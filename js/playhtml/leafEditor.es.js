function o(r) {
  return r === null ? !0 : typeof r == "number" ? Number.isFinite(r) : typeof r == "string" || typeof r == "boolean";
}
function l(r) {
  return JSON.stringify(r);
}
function c(r) {
  const e = r.trim();
  if (!e)
    return {
      ok: !1,
      error: "Enter a JSON string, number, boolean, or null."
    };
  let t;
  try {
    t = JSON.parse(e);
  } catch {
    return {
      ok: !1,
      error: "Enter a valid JSON string, number, boolean, or null."
    };
  }
  return o(t) ? { ok: !0, value: t } : {
    ok: !1,
    error: "Only primitive values can be edited inline."
  };
}
function y(r, e, t) {
  if (e.length === 0)
    return {
      ok: !1,
      error: "Choose a value inside the state tree."
    };
  const n = f(r, e);
  return n.exists ? o(n.value) ? {
    ok: !0,
    data: a(r, e, t)
  } : {
    ok: !1,
    error: "Only primitive values can be edited inline."
  } : { ok: !1, error: "State path does not exist." };
}
function f(r, e) {
  let t = r;
  for (const n of e) {
    if (!s(t, n))
      return { exists: !1 };
    t = t[n];
  }
  return { exists: !0, value: t };
}
function s(r, e) {
  return Array.isArray(r) ? typeof e == "number" && Number.isInteger(e) && e >= 0 && e < r.length : r === null || typeof r != "object" ? !1 : Object.prototype.hasOwnProperty.call(r, String(e));
}
function a(r, e, t) {
  const [n, ...u] = e;
  if (n === void 0) return t;
  const i = Array.isArray(r) ? [...r] : { ...r };
  return i[n] = a(
    r[n],
    u,
    t
  ), i;
}
export {
  l as formatStateLeafValue,
  o as isEditableStateLeaf,
  c as parseStateLeafValue,
  y as replaceStateLeafValue
};
