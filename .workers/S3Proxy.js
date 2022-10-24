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

//get all search param starting with X-Amz-meta
const getMetaParams = (url) => {
  const metaParams = {};
  url.searchParams.forEach((value, key) => {
    if (key.toLocaleLowerCase().startsWith("x-amz-meta")) {
      metaParams[key] = value;
    }
  });
  return metaParams;
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
  // Double decodes the URI as the request URL is encoded twice from S3 sdk
  const decodedUrl = decodeURIComponent(decodeURIComponent(request.url));
  const url = new URL(decodedUrl);
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

  const params = {
    ...getBucketAndKey(decodedUrl),
    ContentLength: request.headers.get("content-length"),
    Metadata: {},
  };
  const metaParams = getMetaParams(url);

  Object.keys(metaParams).forEach((key) => {
    params.Metadata[key.replace("x-amz-meta-", "")] = metaParams[key];
  });

  const signedURl = await getSignedUrl(
    proxyS3Client,
    new PutObjectCommand(params),
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

  const decodedUrl = decodeURIComponent(decodeURIComponent(request.url));
  const bucketAndKey = getBucketAndKey(decodedUrl);
  const originalFileName = bucketAndKey.Key;

  bucketAndKey.Key =
    crypto.randomUUID() +
    bucketAndKey.Key.slice(bucketAndKey.Key.lastIndexOf("."));

  const signedRequest = await getSignedUrl(
    s3Client,
    new PutObjectCommand({
      ...bucketAndKey,
      Body: request.body,
    }),
    {
      expiresIn: 3600,
    }
  );

  const s3Response = await fetch(signedRequest, {
    method: "PUT",
    body: request.body,
    headers: request.headers,
  });

  const s3MediaUrl = `${CDN_URL}/${bucketAndKey.Bucket}/${bucketAndKey.Key}`;

  const response = new Response(s3MediaUrl, s3Response);
  response.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);

  if (response.status === 200) {
    const contentLength = parseInt(request.headers.get("content-length") || 0);
    const metaParams = {};
    const url = new URL(request.url);

    Object.keys(getMetaParams(url)).forEach((key) => {
      metaParams[key.replace("x-amz-meta-", "").replaceAll("-", "")] =
        getSearchParam(url, key);
    });

    let hookURL = MEDIA_WEBHOOK_URL;

    if (metaParams["linkid"]) {
      hookURL = FILE_SHARE_WEBHOOK_URL;
    }

    const webhookResponse = await fetch(hookURL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: request.headers.get("X-Authorization-Firebase"),
      },
      body: JSON.stringify({
        size: contentLength,
        contentType: request.headers.get("content-type"),
        id: bucketAndKey.Key,
        url: s3MediaUrl,
        originalFileName,
        ...metaParams,
      }),
    });

    console.log(webhookResponse);
  }
  return response;
}
