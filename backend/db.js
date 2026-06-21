const fs = require("fs");
const path = require("path");

const envFiles = [
  path.join(__dirname, ".env"),
  path.join(__dirname, "..", ".env"),
];

for (const envFile of envFiles) {
  if (!fs.existsSync(envFile)) {
    continue;
  }

  const lines = fs.readFileSync(envFile, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);

    if (!match) {
      continue;
    }

    const key = match[1];
    const value = match[2].replace(/^["']|["']$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;

const supabaseKey =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Faltan SUPABASE_URL y SUPABASE_PUBLISHABLE_KEY en el entorno"
  );
}

const tableCandidates = {
  usuarios: ["usuarios"],
  cliente: ["cliente", "Cliente"],
  producto: ["producto", "Producto"],
  pedido: ["pedido", "Pedido"],
  producto_pedido: ["producto_pedido", "Producto_Pedido"],
  garantia: ["garantia", "Garantia"],
  solicitud: ["solicitud", "Solicitud"],
  revision_logistica: ["revision_logistica", "Revision_Logistica"],
  evaluacion_tecnica: ["evaluacion_tecnica", "Evaluacion_Tecnica"],
};

function tableNames(tableKey) {
  const envKey = `SUPABASE_TABLE_${tableKey.toUpperCase()}`;
  const configured = process.env[envKey];

  if (configured) {
    return [configured];
  }

  return tableCandidates[tableKey] || [tableKey];
}

function shouldTryNextTable(status, body) {
  return (
    status === 404 ||
    body.includes("PGRST205") ||
    body.includes("Could not find the table")
  );
}

async function request(tableKey, query = {}, options = {}) {
  const names = tableNames(tableKey);
  let lastError;

  for (const tableName of names) {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        params.set(key, value);
      }
    }

    const url = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/${encodeURIComponent(
      tableName
    )}?${params.toString()}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (response.ok) {
      if (response.status === 204) {
        return null;
      }

      return response.json();
    }

    const body = await response.text();
    lastError = new Error(
      `Supabase ${response.status} en ${tableName}: ${body}`
    );

    if (!shouldTryNextTable(response.status, body)) {
      break;
    }
  }

  throw lastError;
}

async function select(tableKey, query = {}) {
  return request(tableKey, query);
}

async function insert(tableKey, row) {
  const rows = await request(tableKey, { select: "*" }, {
    method: "POST",
    headers: {
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
  });

  return rows[0];
}

async function update(tableKey, filters, row) {
  const rows = await request(tableKey, { select: "*", ...filters }, {
    method: "PATCH",
    headers: {
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
  });

  return rows;
}

function inFilter(values) {
  return `in.(${values.join(",")})`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

module.exports = {
  select,
  insert,
  update,
  inFilter,
  today,
};
