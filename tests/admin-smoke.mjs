import assert from "node:assert/strict";

const baseUrl = (process.env.ADMIN_TEST_BASE_URL || "").replace(/\/$/, "");
const adminUsername = process.env.ADMIN_TEST_USERNAME;
const adminPassword = process.env.ADMIN_TEST_PASSWORD;

if (!baseUrl || !adminUsername || !adminPassword) {
  throw new Error(
    "Set ADMIN_TEST_BASE_URL, ADMIN_TEST_USERNAME, and ADMIN_TEST_PASSWORD before running admin smoke tests.",
  );
}

function createClient() {
  const cookies = new Map();

  function storeCookies(response) {
    const setCookieHeaders =
      typeof response.headers.getSetCookie === "function"
        ? response.headers.getSetCookie()
        : response.headers.get("set-cookie")
          ? [response.headers.get("set-cookie")]
          : [];

    for (const header of setCookieHeaders) {
      const [pair] = header.split(";");
      const [name, ...valueParts] = pair.split("=");
      cookies.set(name, valueParts.join("="));
    }
  }

  async function request(path, options = {}) {
    const headers = new Headers(options.headers || {});
    if (cookies.size) {
      headers.set(
        "Cookie",
        [...cookies.entries()].map(([name, value]) => `${name}=${value}`).join("; "),
      );
    }

    if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
      body:
        options.body && !(options.body instanceof FormData) && typeof options.body !== "string"
          ? JSON.stringify(options.body)
          : options.body,
    });
    storeCookies(response);
    return response;
  }

  return { request };
}

async function json(response) {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function expectStatus(response, expected, label) {
  if (response.status !== expected) {
    assert.fail(`${label}: expected ${expected}, got ${response.status} ${await response.text()}`);
  }
}

async function main() {
  const stamp = Date.now();
  const admin = createClient();
  const created = { mediaId: null, productId: null, blogId: null };

  try {
    await expectStatus(await admin.request("/health"), 200, "health check");

    const login = await admin.request("/api/auth/login", {
      method: "POST",
      body: { username: adminUsername, password: adminPassword },
    });
    await expectStatus(login, 200, "admin login");
    const loginData = await json(login);
    assert.equal(loginData.user.role, "admin", "login user should be admin");

    await expectStatus(await admin.request("/api/admin/check"), 200, "admin check");
    await expectStatus(await admin.request("/api/admin/settings"), 200, "read settings");

    const settingsUpdate = await admin.request("/api/admin/settings", {
      method: "POST",
      body: { adminSmokeTestTimestamp: String(stamp) },
    });
    await expectStatus(settingsUpdate, 200, "edit page copy/settings");

    const form = new FormData();
    form.append(
      "file",
      new Blob([Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFgwJ/lO3yWQAAAABJRU5ErkJggg==", "base64")], {
        type: "image/png",
      }),
      `admin-smoke-${stamp}.png`,
    );
    const upload = await admin.request("/api/admin/upload", { method: "POST", body: form });
    await expectStatus(upload, 200, "upload photo");
    const uploadData = await json(upload);
    created.mediaId = uploadData.id;
    assert.ok(uploadData.url, "upload should return a file URL");

    const productCreate = await admin.request("/api/admin/products", {
      method: "POST",
      body: {
        name: `Admin Smoke Product ${stamp}`,
        description: "Temporary product created by admin smoke test.",
        price: "1.00",
        category: "accessories",
        imageUrl: uploadData.url,
        inStock: true,
        stockQuantity: 1,
        isFeatured: false,
      },
    });
    await expectStatus(productCreate, 201, "create product");
    const product = await json(productCreate);
    created.productId = product.id;

    await expectStatus(
      await admin.request(`/api/admin/products/${created.productId}`, {
        method: "PATCH",
        body: { name: `Admin Smoke Product Updated ${stamp}` },
      }),
      200,
      "edit product",
    );

    const blogCreate = await admin.request("/api/blog/posts", {
      method: "POST",
      body: {
        slug: `admin-smoke-${stamp}`,
        title: `Admin Smoke Blog ${stamp}`,
        excerpt: "Temporary blog post created by admin smoke test.",
        content: "Temporary admin smoke test content.",
        featuredImage: uploadData.url,
        author: "Admin Smoke Test",
        category: "News",
        tags: ["admin-smoke"],
        publishedAt: new Date().toISOString(),
        published: false,
        metaDescription: "Temporary admin smoke test post.",
        metaKeywords: ["admin-smoke"],
      },
    });
    await expectStatus(blogCreate, 201, "create blog post");
    const blog = await json(blogCreate);
    created.blogId = blog.id;

    await expectStatus(
      await admin.request(`/api/blog/posts/${created.blogId}`, {
        method: "PUT",
        body: { title: `Admin Smoke Blog Updated ${stamp}` },
      }),
      200,
      "edit blog post",
    );

    const user = createClient();
    const testUsername = `admin-smoke-user-${stamp}`;
    const register = await user.request("/api/auth/register", {
      method: "POST",
      body: {
        username: testUsername,
        email: `${testUsername}@example.com`,
        password: "SmokeTest123!",
        firstName: "Admin",
        lastName: "Smoke",
      },
    });
    await expectStatus(register, 201, "register customer user");
    const registered = await json(register);
    assert.equal(registered.user.role, "customer", "registered user should start as customer");

    await expectStatus(await user.request("/api/admin/users"), 403, "customer blocked from admin users");

    await expectStatus(
      await admin.request(`/api/admin/users/${registered.user.id}/role`, {
        method: "PATCH",
        body: { role: "admin" },
      }),
      200,
      "promote user to admin",
    );
    await expectStatus(await user.request("/api/admin/users"), 200, "promoted user can access admin users");
    await expectStatus(
      await admin.request(`/api/admin/users/${registered.user.id}/role`, {
        method: "PATCH",
        body: { role: "customer" },
      }),
      200,
      "demote user to customer",
    );

    await expectStatus(await admin.request("/api/admin/subscribers"), 200, "view subscribers");
    const csv = await admin.request("/api/admin/download/subscribers");
    assert.ok([200, 404].includes(csv.status), `download subscribers CSV returned ${csv.status}`);
    if (csv.status === 200) {
      assert.match(csv.headers.get("content-type") || "", /text\/csv/, "subscriber export should be CSV");
    }
  } finally {
    if (created.blogId) {
      await admin.request(`/api/blog/posts/${created.blogId}`, { method: "DELETE" });
    }
    if (created.productId) {
      await admin.request(`/api/admin/products/${created.productId}`, { method: "DELETE" });
    }
    if (created.mediaId) {
      await admin.request(`/api/admin/media/${created.mediaId}`, { method: "DELETE" });
    }
  }
}

await main();
console.log("Admin smoke tests passed.");
