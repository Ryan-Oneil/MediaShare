import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

addEventListener("fetch", (event) => {
  if (event.request.method === "OPTIONS") {
    event.respondWith(handleOptions(event.request));
  } else if (event.request.method === "PUT") {
    event.respondWith(handlePutRequest(event));
  } else {
    event.respondWith(new Response("Method not allowed", { status: 405 }));
  }
});

const getSearchParam = (url, param) => {
  const paramSearch = url.searchParams.get(param);

  if (!paramSearch) {
    throw new Error("Missing param " + param);
  }
  return paramSearch;
};

const getBucketAndKey = (url) => {
  const splitUrl = url.split("/");
  return {
    Bucket: splitUrl[3],
    Key: splitUrl[4].split("?")[0],
  };
};

// Verify the signature on the incoming request
async function verifySignature(request) {
  const url = new URL(request.url);
  const credential = getSearchParam(url, "X-Amz-Credential");
  const accessKeyId = credential.split("/")[0];

  if (accessKeyId !== AWS_ACCESS_KEY_ID) {
    throw new Error("Error validating signature: invalid access key");
  }

  const date = getSearchParam(url, "date");

  const proxyS3Client = new S3Client({
    region: AWS_S3_REGION,
    endpoint: `https://${url.host}`,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  });

  const signedURl = await getSignedUrl(
    proxyS3Client,
    new PutObjectCommand(getBucketAndKey(request.url)),
    {
      expiresIn: 3600,
      signingDate: new Date(date),
    }
  );

  const signature = getSearchParam(url, "X-Amz-Signature");
  const generatedSignature = getSearchParam(
    new URL(signedURl),
    "X-Amz-Signature"
  );

  if (signature !== generatedSignature) {
    throw new Error("Error validating signature: invalid signature");
  }
}

function handleOptions(request) {
  const headers = request.headers;

  if (
    !headers.get("Origin") ||
    !headers.get("Access-Control-Request-Method") ||
    !headers.get("Access-Control-Request-Headers")
  ) {
    return new Response(null, {
      headers: {
        Allow: "GET, HEAD, POST, OPTIONS",
      },
    });
  }
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT,OPTIONS",
      "Access-Control-Max-Age": "86400",
      "Access-Control-Allow-Headers": request.headers.get(
        "Access-Control-Request-Headers"
      ),
    },
  });
}

async function handlePutRequest(event) {
  const request = event.request;

  try {
    await verifySignature(request);
  } catch (e) {
    return new Response(JSON.stringify(e.message), {
      status: 403,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "max-age=0, no-cache, no-store",
      },
    });
  }

  const s3Client = new S3Client({
    region: AWS_S3_REGION,
    endpoint: AWS_S3_ENDPOINT,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  });

  console.log(request.body.file);

  const signedRequest = await getSignedUrl(
    s3Client,
    new PutObjectCommand({
      ...getBucketAndKey(request.url),
      Body: request.body,
    }),
    {
      expiresIn: 3600,
    }
  );

  const response = await fetch(signedRequest, {
    method: "PUT",
    body: request.body,
    headers: request.headers,
  });

  if (WEBHOOK_URL && response.status === 200) {
    const contentLength = parseInt(request.headers.get("content-length") || 0);

    event.waitUntil(
      fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: request.headers.get("Authorization"),
        },
        body: JSON.stringify({
          mediaSize: contentLength,
          mediaType: request.headers.get("content-type"),
          url: response.url,
        }),
      })
    );
  }
  return response;
}
