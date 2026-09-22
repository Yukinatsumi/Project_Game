import "./leafEditor.es.js";
const go = 1, yo = 2, nr = 4, sr = 8, un = 32, De = 64, ie = 128, Ms = 31, Tr = 63, ot = 127, Yu = 2147483647, pe = Math.floor, os = Math.abs, ri = (t, e) => t < e ? t : e, vt = (t, e) => t > e ? t : e, Gu = Math.pow, qc = (t) => t !== 0 ? t < 0 : 1 / t < 0, ps = Number.MAX_SAFE_INTEGER, mo = Number.MIN_SAFE_INTEGER, qu = Number.isInteger || ((t) => typeof t == "number" && isFinite(t) && pe(t) === t), Ve = () => /* @__PURE__ */ new Set(), rr = (t) => t[t.length - 1], Ju = (t, e) => {
  for (let n = 0; n < e.length; n++)
    t.push(e[n]);
}, Le = Array.from, ii = (t, e) => {
  for (let n = 0; n < t.length; n++)
    if (!e(t[n], n, t))
      return !1;
  return !0;
}, Jc = (t, e) => {
  for (let n = 0; n < t.length; n++)
    if (e(t[n], n, t))
      return !0;
  return !1;
}, Xu = (t, e) => {
  const n = new Array(t);
  for (let s = 0; s < t; s++)
    n[s] = e(s, n);
  return n;
}, $s = Array.isArray, Xc = String.fromCharCode, Zu = (t) => t.toLowerCase(), Qu = /^\s*/g, eh = (t) => t.replace(Qu, ""), th = /([A-Z])/g, wo = (t, e) => eh(t.replace(th, (n) => `${e}${Zu(n)}`)), nh = (t) => {
  const e = unescape(encodeURIComponent(t)), n = e.length, s = new Uint8Array(n);
  for (let r = 0; r < n; r++)
    s[r] = /** @type {number} */
    e.codePointAt(r);
  return s;
}, hn = (
  /** @type {TextEncoder} */
  typeof TextEncoder < "u" ? new TextEncoder() : null
), sh = (t) => hn.encode(t), rh = hn ? sh : nh;
let tn = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
tn && tn.decode(new Uint8Array()).length === 1 && (tn = null);
const ih = (t, e) => Xu(e, () => t).join(""), Ce = (t) => new Error(t), de = () => {
  throw Ce("Method unimplemented");
}, ce = () => {
  throw Ce("Unexpected case");
};
class Mn {
  constructor() {
    this.cpos = 0, this.cbuf = new Uint8Array(100), this.bufs = [];
  }
}
const Y = () => new Mn(), oi = (t) => {
  let e = t.cpos;
  for (let n = 0; n < t.bufs.length; n++)
    e += t.bufs[n].length;
  return e;
}, T = (t) => {
  const e = new Uint8Array(oi(t));
  let n = 0;
  for (let s = 0; s < t.bufs.length; s++) {
    const r = t.bufs[s];
    e.set(r, n), n += r.length;
  }
  return e.set(new Uint8Array(t.cbuf.buffer, 0, t.cpos), n), e;
}, oh = (t, e) => {
  const n = t.cbuf.length;
  n - t.cpos < e && (t.bufs.push(new Uint8Array(t.cbuf.buffer, 0, t.cpos)), t.cbuf = new Uint8Array(vt(n, e) * 2), t.cpos = 0);
}, U = (t, e) => {
  const n = t.cbuf.length;
  t.cpos === n && (t.bufs.push(t.cbuf), t.cbuf = new Uint8Array(n * 2), t.cpos = 0), t.cbuf[t.cpos++] = e;
}, Lr = U, b = (t, e) => {
  for (; e > ot; )
    U(t, ie | ot & e), e = pe(e / 128);
  U(t, ot & e);
}, ci = (t, e) => {
  const n = qc(e);
  for (n && (e = -e), U(t, (e > Tr ? ie : 0) | (n ? De : 0) | Tr & e), e = pe(e / 64); e > 0; )
    U(t, (e > ot ? ie : 0) | ot & e), e = pe(e / 128);
}, Ir = new Uint8Array(3e4), ch = Ir.length / 3, ah = (t, e) => {
  if (e.length < ch) {
    const n = hn.encodeInto(e, Ir).written || 0;
    b(t, n);
    for (let s = 0; s < n; s++)
      U(t, Ir[s]);
  } else
    I(t, rh(e));
}, lh = (t, e) => {
  const n = unescape(encodeURIComponent(e)), s = n.length;
  b(t, s);
  for (let r = 0; r < s; r++)
    U(
      t,
      /** @type {number} */
      n.codePointAt(r)
    );
}, ct = hn && /** @type {any} */
hn.encodeInto ? ah : lh, Os = (t, e) => {
  const n = t.cbuf.length, s = t.cpos, r = ri(n - s, e.length), i = e.length - r;
  t.cbuf.set(e.subarray(0, r), s), t.cpos += r, i > 0 && (t.bufs.push(t.cbuf), t.cbuf = new Uint8Array(vt(n * 2, i)), t.cbuf.set(e.subarray(r)), t.cpos = i);
}, I = (t, e) => {
  b(t, e.byteLength), Os(t, e);
}, ai = (t, e) => {
  oh(t, e);
  const n = new DataView(t.cbuf.buffer, t.cpos, e);
  return t.cpos += e, n;
}, uh = (t, e) => ai(t, 4).setFloat32(0, e, !1), hh = (t, e) => ai(t, 8).setFloat64(0, e, !1), dh = (t, e) => (
  /** @type {any} */
  ai(t, 8).setBigInt64(0, e, !1)
), bo = new DataView(new ArrayBuffer(4)), fh = (t) => (bo.setFloat32(0, t), bo.getFloat32(0) === t), dn = (t, e) => {
  switch (typeof e) {
    case "string":
      U(t, 119), ct(t, e);
      break;
    case "number":
      qu(e) && os(e) <= Yu ? (U(t, 125), ci(t, e)) : fh(e) ? (U(t, 124), uh(t, e)) : (U(t, 123), hh(t, e));
      break;
    case "bigint":
      U(t, 122), dh(t, e);
      break;
    case "object":
      if (e === null)
        U(t, 126);
      else if ($s(e)) {
        U(t, 117), b(t, e.length);
        for (let n = 0; n < e.length; n++)
          dn(t, e[n]);
      } else if (e instanceof Uint8Array)
        U(t, 116), I(t, e);
      else {
        U(t, 118);
        const n = Object.keys(e);
        b(t, n.length);
        for (let s = 0; s < n.length; s++) {
          const r = n[s];
          ct(t, r), dn(t, e[r]);
        }
      }
      break;
    case "boolean":
      U(t, e ? 120 : 121);
      break;
    default:
      U(t, 127);
  }
};
class vo extends Mn {
  /**
   * @param {function(Encoder, T):void} writer
   */
  constructor(e) {
    super(), this.w = e, this.s = null, this.count = 0;
  }
  /**
   * @param {T} v
   */
  write(e) {
    this.s === e ? this.count++ : (this.count > 0 && b(this, this.count - 1), this.count = 1, this.w(this, e), this.s = e);
  }
}
const Co = (t) => {
  t.count > 0 && (ci(t.encoder, t.count === 1 ? t.s : -t.s), t.count > 1 && b(t.encoder, t.count - 2));
};
class cs {
  constructor() {
    this.encoder = new Mn(), this.s = 0, this.count = 0;
  }
  /**
   * @param {number} v
   */
  write(e) {
    this.s === e ? this.count++ : (Co(this), this.count = 1, this.s = e);
  }
  /**
   * Flush the encoded state and transform this to a Uint8Array.
   *
   * Note that this should only be called once.
   */
  toUint8Array() {
    return Co(this), T(this.encoder);
  }
}
const So = (t) => {
  if (t.count > 0) {
    const e = t.diff * 2 + (t.count === 1 ? 0 : 1);
    ci(t.encoder, e), t.count > 1 && b(t.encoder, t.count - 2);
  }
};
class ir {
  constructor() {
    this.encoder = new Mn(), this.s = 0, this.count = 0, this.diff = 0;
  }
  /**
   * @param {number} v
   */
  write(e) {
    this.diff === e - this.s ? (this.s = e, this.count++) : (So(this), this.count = 1, this.diff = e - this.s, this.s = e);
  }
  /**
   * Flush the encoded state and transform this to a Uint8Array.
   *
   * Note that this should only be called once.
   */
  toUint8Array() {
    return So(this), T(this.encoder);
  }
}
class ph {
  constructor() {
    this.sarr = [], this.s = "", this.lensE = new cs();
  }
  /**
   * @param {string} string
   */
  write(e) {
    this.s += e, this.s.length > 19 && (this.sarr.push(this.s), this.s = ""), this.lensE.write(e.length);
  }
  toUint8Array() {
    const e = new Mn();
    return this.sarr.push(this.s), this.s = "", ct(e, this.sarr.join("")), Os(e, this.lensE.toUint8Array()), T(e);
  }
}
const Zc = Ce("Unexpected end of array"), Qc = Ce("Integer out of Range");
class Ps {
  /**
   * @param {Uint8Array<Buf>} uint8Array Binary data to decode
   */
  constructor(e) {
    this.arr = e, this.pos = 0;
  }
}
const qe = (t) => new Ps(t), gh = (t) => t.pos !== t.arr.length, yh = (t, e) => {
  const n = new Uint8Array(t.arr.buffer, t.pos + t.arr.byteOffset, e);
  return t.pos += e, n;
}, W = (t) => yh(t, S(t)), Mt = (t) => t.arr[t.pos++], S = (t) => {
  let e = 0, n = 1;
  const s = t.arr.length;
  for (; t.pos < s; ) {
    const r = t.arr[t.pos++];
    if (e = e + (r & ot) * n, n *= 128, r < ie)
      return e;
    if (e > ps)
      throw Qc;
  }
  throw Zc;
}, li = (t) => {
  let e = t.arr[t.pos++], n = e & Tr, s = 64;
  const r = (e & De) > 0 ? -1 : 1;
  if ((e & ie) === 0)
    return r * n;
  const i = t.arr.length;
  for (; t.pos < i; ) {
    if (e = t.arr[t.pos++], n = n + (e & ot) * s, s *= 128, e < ie)
      return r * n;
    if (n > ps)
      throw Qc;
  }
  throw Zc;
}, mh = (t) => {
  let e = S(t);
  if (e === 0)
    return "";
  {
    let n = String.fromCodePoint(Mt(t));
    if (--e < 100)
      for (; e--; )
        n += String.fromCodePoint(Mt(t));
    else
      for (; e > 0; ) {
        const s = e < 1e4 ? e : 1e4, r = t.arr.subarray(t.pos, t.pos + s);
        t.pos += s, n += String.fromCodePoint.apply(
          null,
          /** @type {any} */
          r
        ), e -= s;
      }
    return decodeURIComponent(escape(n));
  }
}, wh = (t) => (
  /** @type any */
  tn.decode(W(t))
), He = tn ? wh : mh, ui = (t, e) => {
  const n = new DataView(t.arr.buffer, t.arr.byteOffset + t.pos, e);
  return t.pos += e, n;
}, bh = (t) => ui(t, 4).getFloat32(0, !1), vh = (t) => ui(t, 8).getFloat64(0, !1), Ch = (t) => (
  /** @type {any} */
  ui(t, 8).getBigInt64(0, !1)
), Sh = [
  (t) => {
  },
  // CASE 127: undefined
  (t) => null,
  // CASE 126: null
  li,
  // CASE 125: integer
  bh,
  // CASE 124: float32
  vh,
  // CASE 123: float64
  Ch,
  // CASE 122: bigint
  (t) => !1,
  // CASE 121: boolean (false)
  (t) => !0,
  // CASE 120: boolean (true)
  He,
  // CASE 119: string
  (t) => {
    const e = S(t), n = {};
    for (let s = 0; s < e; s++) {
      const r = He(t);
      n[r] = fn(t);
    }
    return n;
  },
  (t) => {
    const e = S(t), n = [];
    for (let s = 0; s < e; s++)
      n.push(fn(t));
    return n;
  },
  W
  // CASE 116: Uint8Array
], fn = (t) => Sh[127 - Mt(t)](t);
class Eo extends Ps {
  /**
   * @param {Uint8Array} uint8Array
   * @param {function(Decoder):T} reader
   */
  constructor(e, n) {
    super(e), this.reader = n, this.s = null, this.count = 0;
  }
  read() {
    return this.count === 0 && (this.s = this.reader(this), gh(this) ? this.count = S(this) + 1 : this.count = -1), this.count--, /** @type {T} */
    this.s;
  }
}
class as extends Ps {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor(e) {
    super(e), this.s = 0, this.count = 0;
  }
  read() {
    if (this.count === 0) {
      this.s = li(this);
      const e = qc(this.s);
      this.count = 1, e && (this.s = -this.s, this.count = S(this) + 2);
    }
    return this.count--, /** @type {number} */
    this.s;
  }
}
class or extends Ps {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor(e) {
    super(e), this.s = 0, this.count = 0, this.diff = 0;
  }
  /**
   * @return {number}
   */
  read() {
    if (this.count === 0) {
      const e = li(this), n = e & 1;
      this.diff = pe(e / 2), this.count = 1, n && (this.count = S(this) + 2);
    }
    return this.s += this.diff, this.count--, this.s;
  }
}
class Eh {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor(e) {
    this.decoder = new as(e), this.str = He(this.decoder), this.spos = 0;
  }
  /**
   * @return {string}
   */
  read() {
    const e = this.spos + this.decoder.read(), n = this.str.slice(this.spos, e);
    return this.spos = e, n;
  }
}
const $t = Date.now, te = () => /* @__PURE__ */ new Map(), Mr = (t) => {
  const e = te();
  return t.forEach((n, s) => {
    e.set(s, n);
  }), e;
}, ke = (t, e, n) => {
  let s = t.get(e);
  return s === void 0 && t.set(e, s = n()), s;
}, _h = (t, e) => {
  const n = [];
  for (const [s, r] of t)
    n.push(e(r, s));
  return n;
}, Ah = (t, e) => {
  for (const [n, s] of t)
    if (e(s, n))
      return !0;
  return !1;
};
class kh {
  constructor() {
    this._observers = te();
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  on(e, n) {
    return ke(
      this._observers,
      /** @type {string} */
      e,
      Ve
    ).add(n), n;
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  once(e, n) {
    const s = (...r) => {
      this.off(
        e,
        /** @type {any} */
        s
      ), n(...r);
    };
    this.on(
      e,
      /** @type {any} */
      s
    );
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  off(e, n) {
    const s = this._observers.get(e);
    s !== void 0 && (s.delete(n), s.size === 0 && this._observers.delete(e));
  }
  /**
   * Emit a named event. All registered event listeners that listen to the
   * specified name will receive the event.
   *
   * @todo This should catch exceptions
   *
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name The event name.
   * @param {Parameters<EVENTS[NAME]>} args The arguments that are applied to the event listener.
   */
  emit(e, n) {
    return Le((this._observers.get(e) || te()).values()).forEach((s) => s(...n));
  }
  destroy() {
    this._observers = te();
  }
}
class ea {
  constructor() {
    this._observers = te();
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  on(e, n) {
    ke(this._observers, e, Ve).add(n);
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  once(e, n) {
    const s = (...r) => {
      this.off(e, s), n(...r);
    };
    this.on(e, s);
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  off(e, n) {
    const s = this._observers.get(e);
    s !== void 0 && (s.delete(n), s.size === 0 && this._observers.delete(e));
  }
  /**
   * Emit a named event. All registered event listeners that listen to the
   * specified name will receive the event.
   *
   * @todo This should catch exceptions
   *
   * @param {N} name The event name.
   * @param {Array<any>} args The arguments that are applied to the event listener.
   */
  emit(e, n) {
    return Le((this._observers.get(e) || te()).values()).forEach((s) => s(...n));
  }
  destroy() {
    this._observers = te();
  }
}
const pn = /* @__PURE__ */ Symbol("Equality"), ta = (t, e) => t === e || !!t?.[pn]?.(e) || !1, xh = (t) => typeof t == "object", Dh = Object.assign, Th = Object.keys, Lh = (t, e) => {
  for (const n in t)
    e(t[n], n);
}, Ih = (t, e) => {
  const n = [];
  for (const s in t)
    n.push(e(t[s], s));
  return n;
}, gs = (t) => Th(t).length, Mh = (t) => {
  for (const e in t)
    return !1;
  return !0;
}, $n = (t, e) => {
  for (const n in t)
    if (!e(t[n], n))
      return !1;
  return !0;
}, hi = (t, e) => Object.prototype.hasOwnProperty.call(t, e), $h = (t, e) => t === e || gs(t) === gs(e) && $n(t, (n, s) => (n !== void 0 || hi(e, s)) && ta(e[s], n)), di = (t, e, n = 0) => {
  try {
    for (; n < t.length; n++)
      t[n](...e);
  } finally {
    n < t.length && di(t, e, n + 1);
  }
}, Oh = (t) => t, xt = (t, e) => {
  if (t === e)
    return !0;
  if (t == null || e == null || t.constructor !== e.constructor && (t.constructor || Object) !== (e.constructor || Object))
    return !1;
  if (t[pn] != null)
    return t[pn](e);
  switch (t.constructor) {
    case ArrayBuffer:
      t = new Uint8Array(t), e = new Uint8Array(e);
    // eslint-disable-next-line no-fallthrough
    case Uint8Array: {
      if (t.byteLength !== e.byteLength)
        return !1;
      for (let n = 0; n < t.length; n++)
        if (t[n] !== e[n])
          return !1;
      break;
    }
    case Set: {
      if (t.size !== e.size)
        return !1;
      for (const n of t)
        if (!e.has(n))
          return !1;
      break;
    }
    case Map: {
      if (t.size !== e.size)
        return !1;
      for (const n of t.keys())
        if (!e.has(n) || !xt(t.get(n), e.get(n)))
          return !1;
      break;
    }
    case void 0:
    case Object:
      if (gs(t) !== gs(e))
        return !1;
      for (const n in t)
        if (!hi(t, n) || !xt(t[n], e[n]))
          return !1;
      break;
    case Array:
      if (t.length !== e.length)
        return !1;
      for (let n = 0; n < t.length; n++)
        if (!xt(t[n], e[n]))
          return !1;
      break;
    default:
      return !1;
  }
  return !0;
}, Ph = (t, e) => e.includes(t), Rh = crypto.getRandomValues.bind(crypto), na = () => Rh(new Uint32Array(1))[0], Nh = "10000000-1000-4000-8000" + -1e11, Uh = () => Nh.replace(
  /[018]/g,
  /** @param {number} c */
  (t) => (t ^ na() & 15 >> t / 4).toString(16)
), _o = (t) => (
  /** @type {Promise<T>} */
  new Promise(t)
);
Promise.all.bind(Promise);
const Ao = (t) => t === void 0 ? null : t;
class Fh {
  constructor() {
    this.map = /* @__PURE__ */ new Map();
  }
  /**
   * @param {string} key
   * @param {any} newValue
   */
  setItem(e, n) {
    this.map.set(e, n);
  }
  /**
   * @param {string} key
   */
  getItem(e) {
    return this.map.get(e);
  }
}
let sa = new Fh(), fi = !0;
try {
  typeof localStorage < "u" && localStorage && (sa = localStorage, fi = !1);
} catch {
}
const ra = sa, jh = (t) => fi || addEventListener(
  "storage",
  /** @type {any} */
  t
), Hh = (t) => fi || removeEventListener(
  "storage",
  /** @type {any} */
  t
), Ot = typeof process < "u" && process.release && /node|io\.js/.test(process.release.name) && Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]", ia = typeof window < "u" && typeof document < "u" && !Ot;
let we;
const zh = () => {
  if (we === void 0)
    if (Ot) {
      we = te();
      const t = process.argv;
      let e = null;
      for (let n = 0; n < t.length; n++) {
        const s = t[n];
        s[0] === "-" ? (e !== null && we.set(e, ""), e = s) : e !== null && (we.set(e, s), e = null);
      }
      e !== null && we.set(e, "");
    } else typeof location == "object" ? (we = te(), (location.search || "?").slice(1).split("&").forEach((t) => {
      if (t.length !== 0) {
        const [e, n] = t.split("=");
        we.set(`--${wo(e, "-")}`, n), we.set(`-${wo(e, "-")}`, n);
      }
    })) : we = te();
  return we;
}, $r = (t) => zh().has(t), Or = (t) => Ao(Ot ? process.env[t.toUpperCase().replaceAll("-", "_")] : ra.getItem(t)), oa = (t) => $r("--" + t) || Or(t) !== null, Bh = oa("production"), Vh = Ot && Ph(process.env.FORCE_COLOR, ["true", "1", "2"]), Kh = Vh || !$r("--no-colors") && // @todo deprecate --no-colors
!oa("no-color") && (!Ot || process.stdout.isTTY) && (!Ot || $r("--color") || Or("COLORTERM") !== null || (Or("TERM") || "").includes("color")), ca = (t) => new Uint8Array(t), Wh = (t, e, n) => new Uint8Array(t, e, n), Yh = (t) => new Uint8Array(t), Gh = (t) => {
  let e = "";
  for (let n = 0; n < t.byteLength; n++)
    e += Xc(t[n]);
  return btoa(e);
}, qh = (t) => Buffer.from(t.buffer, t.byteOffset, t.byteLength).toString("base64"), Jh = (t) => {
  const e = atob(t), n = ca(e.length);
  for (let s = 0; s < e.length; s++)
    n[s] = e.charCodeAt(s);
  return n;
}, Xh = (t) => {
  const e = Buffer.from(t, "base64");
  return Wh(e.buffer, e.byteOffset, e.byteLength);
}, Zh = ia ? Gh : qh, Qh = ia ? Jh : Xh, ed = (t) => {
  const e = ca(t.byteLength);
  return e.set(t), e;
};
class td {
  /**
   * @param {L} left
   * @param {R} right
   */
  constructor(e, n) {
    this.left = e, this.right = n;
  }
}
const xe = (t, e) => new td(t, e), ko = (t) => t.next() >= 0.5, cr = (t, e, n) => pe(t.next() * (n + 1 - e) + e), aa = (t, e, n) => pe(t.next() * (n + 1 - e) + e), pi = (t, e, n) => aa(t, e, n), nd = (t) => Xc(pi(t, 97, 122)), sd = (t, e = 0, n = 20) => {
  const s = pi(t, e, n);
  let r = "";
  for (let i = 0; i < s; i++)
    r += nd(t);
  return r;
}, ar = (t, e) => e[pi(t, 0, e.length - 1)], rd = /* @__PURE__ */ Symbol("0schema");
class id {
  constructor() {
    this._rerrs = [];
  }
  /**
   * @param {string?} path
   * @param {string} expected
   * @param {string} has
   * @param {string?} message
   */
  extend(e, n, s, r = null) {
    this._rerrs.push({ path: e, expected: n, has: s, message: r });
  }
  toString() {
    const e = [];
    for (let n = this._rerrs.length - 1; n > 0; n--) {
      const s = this._rerrs[n];
      e.push(ih(" ", (this._rerrs.length - n) * 2) + `${s.path != null ? `[${s.path}] ` : ""}${s.has} doesn't match ${s.expected}. ${s.message}`);
    }
    return e.join(`
`);
  }
}
const Pr = (t, e) => t === e ? !0 : t == null || e == null || t.constructor !== e.constructor ? !1 : t[pn] ? ta(t, e) : $s(t) ? ii(
  t,
  (n) => Jc(e, (s) => Pr(n, s))
) : xh(t) ? $n(
  t,
  (n, s) => Pr(n, e[s])
) : !1;
class ee {
  // this.shape must not be defined on Schema. Otherwise typecheck on metatypes (e.g. $$object) won't work as expected anymore
  /**
   * If true, the more things are added to the shape the more objects this schema will accept (e.g.
   * union). By default, the more objects are added, the the fewer objects this schema will accept.
   * @protected
   */
  static _dilutes = !1;
  /**
   * @param {Schema<any>} other
   */
  extends(e) {
    let [n, s] = [
      /** @type {any} */
      this.shape,
      /** @type {any} */
      e.shape
    ];
    return (
      /** @type {typeof Schema<any>} */
      this.constructor._dilutes && ([s, n] = [n, s]), Pr(n, s)
    );
  }
  /**
   * Overwrite this when necessary. By default, we only check the `shape` property which every shape
   * should have.
   * @param {Schema<any>} other
   */
  equals(e) {
    return this.constructor === e.constructor && xt(this.shape, e.shape);
  }
  [rd]() {
    return !0;
  }
  /**
   * @param {object} other
   */
  [pn](e) {
    return this.equals(
      /** @type {any} */
      e
    );
  }
  /**
   * Use `schema.validate(obj)` with a typed parameter that is already of typed to be an instance of
   * Schema. Validate will check the structure of the parameter and return true iff the instance
   * really is an instance of Schema.
   *
   * @param {T} o
   * @return {boolean}
   */
  validate(e) {
    return this.check(e);
  }
  /* c8 ignore start */
  /**
   * Similar to validate, but this method accepts untyped parameters.
   *
   * @param {any} _o
   * @param {ValidationError} [_err]
   * @return {_o is T}
   */
  check(e, n) {
    de();
  }
  /* c8 ignore stop */
  /**
   * @type {Schema<T?>}
   */
  get nullable() {
    return Ht(this, js);
  }
  /**
   * @type {$Optional<Schema<T>>}
   */
  get optional() {
    return new ha(
      /** @type {Schema<T>} */
      this
    );
  }
  /**
   * Cast a variable to a specific type. Returns the casted value, or throws an exception otherwise.
   * Use this if you know that the type is of a specific type and you just want to convince the type
   * system.
   *
   * **Do not rely on these error messages!**
   * Performs an assertion check only if not in a production environment.
   *
   * @template OO
   * @param {OO} o
   * @return {Extract<OO, T> extends never ? T : (OO extends Array<never> ? T : Extract<OO,T>)}
   */
  cast(e) {
    return xo(e, this), /** @type {any} */
    e;
  }
  /**
   * EXPECTO PATRONUM!! 🪄
   * This function protects against type errors. Though it may not work in the real world.
   *
   * "After all this time?"
   * "Always." - Snape, talking about type safety
   *
   * Ensures that a variable is a a specific type. Returns the value, or throws an exception if the assertion check failed.
   * Use this if you know that the type is of a specific type and you just want to convince the type
   * system.
   *
   * Can be useful when defining lambdas: `s.lambda(s.$number, s.$void).expect((n) => n + 1)`
   *
   * **Do not rely on these error messages!**
   * Performs an assertion check if not in a production environment.
   *
   * @param {T} o
   * @return {o extends T ? T : never}
   */
  expect(e) {
    return xo(e, this), e;
  }
}
class gi extends ee {
  /**
   * @param {C} c
   * @param {((o:Instance<C>)=>boolean)|null} check
   */
  constructor(e, n) {
    super(), this.shape = e, this._c = n;
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is C extends ((...args:any[]) => infer T) ? T : (C extends (new (...args:any[]) => any) ? InstanceType<C> : never)} o
   */
  check(e, n = void 0) {
    const s = e?.constructor === this.shape && (this._c == null || this._c(e));
    return !s && n?.extend(null, this.shape.name, e?.constructor.name, e?.constructor !== this.shape ? "Constructor match failed" : "Check failed"), s;
  }
}
const $ = (t, e = null) => new gi(t, e);
$(gi);
class yi extends ee {
  /**
   * @param {(o:any) => boolean} check
   */
  constructor(e) {
    super(), this.shape = e;
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is any}
   */
  check(e, n) {
    const s = this.shape(e);
    return !s && n?.extend(null, "custom prop", e?.constructor.name, "failed to check custom prop"), s;
  }
}
const B = (t) => new yi(t);
$(yi);
class Rs extends ee {
  /**
   * @param {Array<T>} literals
   */
  constructor(e) {
    super(), this.shape = e;
  }
  /**
   *
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is T}
   */
  check(e, n) {
    const s = this.shape.some((r) => r === e);
    return !s && n?.extend(null, this.shape.join(" | "), e.toString()), s;
  }
}
const Ns = (...t) => new Rs(t), la = $(Rs), od = (
  /** @type {any} */
  RegExp.escape || /** @type {(str:string) => string} */
  ((t) => t.replace(/[().|&,$^[\]]/g, (e) => "\\" + e))
), ua = (t) => {
  if (Pt.check(t))
    return [od(t)];
  if (la.check(t))
    return (
      /** @type {Array<string|number>} */
      t.shape.map((e) => e + "")
    );
  if (va.check(t))
    return ["[+-]?\\d+.?\\d*"];
  if (Ca.check(t))
    return [".*"];
  if (ys.check(t))
    return t.shape.map(ua).flat(1);
  ce();
};
class cd extends ee {
  /**
   * @param {T} shape
   */
  constructor(e) {
    super(), this.shape = e, this._r = new RegExp("^" + e.map(ua).map((n) => `(${n.join("|")})`).join("") + "$");
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is CastStringTemplateArgsToTemplate<T>}
   */
  check(e, n) {
    const s = this._r.exec(e) != null;
    return !s && n?.extend(null, this._r.toString(), e.toString(), "String doesn't match string template."), s;
  }
}
$(cd);
const ad = /* @__PURE__ */ Symbol("optional");
class ha extends ee {
  /**
   * @param {S} shape
   */
  constructor(e) {
    super(), this.shape = e;
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is (Unwrap<S>|undefined)}
   */
  check(e, n) {
    const s = e === void 0 || this.shape.check(e);
    return !s && n?.extend(null, "undefined (optional)", "()"), s;
  }
  get [ad]() {
    return !0;
  }
}
const ld = $(ha);
class ud extends ee {
  /**
   * @param {any} _o
   * @param {ValidationError} [err]
   * @return {_o is never}
   */
  check(e, n) {
    return n?.extend(null, "never", typeof e), !1;
  }
}
$(ud);
class Us extends ee {
  /**
   * @param {S} shape
   * @param {boolean} partial
   */
  constructor(e, n = !1) {
    super(), this.shape = e, this._isPartial = n;
  }
  static _dilutes = !0;
  /**
   * @type {Schema<Partial<$ObjectToType<S>>>}
   */
  get partial() {
    return new Us(this.shape, !0);
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is $ObjectToType<S>}
   */
  check(e, n) {
    return e == null ? (n?.extend(null, "object", "null"), !1) : $n(this.shape, (s, r) => {
      const i = this._isPartial && !hi(e, r) || s.check(e[r], n);
      return !i && n?.extend(r.toString(), s.toString(), typeof e[r], "Object property does not match"), i;
    });
  }
}
const hd = (t) => (
  /** @type {any} */
  new Us(t)
), dd = $(Us), fd = B((t) => t != null && (t.constructor === Object || t.constructor == null));
class da extends ee {
  /**
   * @param {Keys} keys
   * @param {Values} values
   */
  constructor(e, n) {
    super(), this.shape = {
      keys: e,
      values: n
    };
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is { [key in Unwrap<Keys>]: Unwrap<Values> }}
   */
  check(e, n) {
    return e != null && $n(e, (s, r) => {
      const i = this.shape.keys.check(r, n);
      return !i && n?.extend(r + "", "Record", typeof e, i ? "Key doesn't match schema" : "Value doesn't match value"), i && this.shape.values.check(s, n);
    });
  }
}
const fa = (t, e) => new da(t, e), pd = $(da);
class pa extends ee {
  /**
   * @param {S} shape
   */
  constructor(e) {
    super(), this.shape = e;
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is { [K in keyof S]: S[K] extends Schema<infer Type> ? Type : never }}
   */
  check(e, n) {
    return e != null && $n(this.shape, (s, r) => {
      const i = (
        /** @type {Schema<any>} */
        s.check(e[r], n)
      );
      return !i && n?.extend(r.toString(), "Tuple", typeof s), i;
    });
  }
}
const gd = (...t) => new pa(t);
$(pa);
class ga extends ee {
  /**
   * @param {Array<S>} v
   */
  constructor(e) {
    super(), this.shape = e.length === 1 ? e[0] : new mi(e);
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is Array<S extends Schema<infer T> ? T : never>} o
   */
  check(e, n) {
    const s = $s(e) && ii(e, (r) => this.shape.check(r));
    return !s && n?.extend(null, "Array", ""), s;
  }
}
const ya = (...t) => new ga(t), yd = $(ga), md = B((t) => $s(t));
class ma extends ee {
  /**
   * @param {new (...args:any) => T} constructor
   * @param {((o:T) => boolean)|null} check
   */
  constructor(e, n) {
    super(), this.shape = e, this._c = n;
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is T}
   */
  check(e, n) {
    const s = e instanceof this.shape && (this._c == null || this._c(e));
    return !s && n?.extend(null, this.shape.name, e?.constructor.name), s;
  }
}
const wd = (t, e = null) => new ma(t, e);
$(ma);
const bd = wd(ee);
class vd extends ee {
  /**
   * @param {Args} args
   */
  constructor(e) {
    super(), this.len = e.length - 1, this.args = gd(...e.slice(-1)), this.res = e[this.len];
  }
  /**
   * @param {any} f
   * @param {ValidationError} err
   * @return {f is _LArgsToLambdaDef<Args>}
   */
  check(e, n) {
    const s = e.constructor === Function && e.length <= this.len;
    return !s && n?.extend(null, "function", typeof e), s;
  }
}
const Cd = $(vd), Sd = B((t) => typeof t == "function");
class Ed extends ee {
  /**
   * @param {T} v
   */
  constructor(e) {
    super(), this.shape = e;
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is Intersect<UnwrapArray<T>>}
   */
  check(e, n) {
    const s = ii(this.shape, (r) => r.check(e, n));
    return !s && n?.extend(null, "Intersectinon", typeof e), s;
  }
}
$(Ed, (t) => t.shape.length > 0);
class mi extends ee {
  static _dilutes = !0;
  /**
   * @param {Array<Schema<S>>} v
   */
  constructor(e) {
    super(), this.shape = e;
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is S}
   */
  check(e, n) {
    const s = Jc(this.shape, (r) => r.check(e, n));
    return n?.extend(null, "Union", typeof e), s;
  }
}
const Ht = (...t) => t.findIndex((e) => ys.check(e)) >= 0 ? Ht(...t.map((e) => gn(e)).map((e) => ys.check(e) ? e.shape : [e]).flat(1)) : t.length === 1 ? t[0] : new mi(t), ys = (
  /** @type {Schema<$Union<any>>} */
  $(mi)
), wa = () => !0, ms = B(wa), _d = (
  /** @type {Schema<Schema<any>>} */
  $(yi, (t) => t.shape === wa)
), wi = B((t) => typeof t == "bigint"), Ad = (
  /** @type {Schema<Schema<BigInt>>} */
  B((t) => t === wi)
), ba = B((t) => typeof t == "symbol");
B((t) => t === ba);
const Dt = B((t) => typeof t == "number"), va = (
  /** @type {Schema<Schema<number>>} */
  B((t) => t === Dt)
), Pt = B((t) => typeof t == "string"), Ca = (
  /** @type {Schema<Schema<string>>} */
  B((t) => t === Pt)
), Fs = B((t) => typeof t == "boolean"), kd = (
  /** @type {Schema<Schema<Boolean>>} */
  B((t) => t === Fs)
), Sa = Ns(void 0);
$(Rs, (t) => t.shape.length === 1 && t.shape[0] === void 0);
Ns(void 0);
const js = Ns(null), xd = (
  /** @type {Schema<Schema<null>>} */
  $(Rs, (t) => t.shape.length === 1 && t.shape[0] === null)
);
$(Uint8Array);
$(gi, (t) => t.shape === Uint8Array);
const Dd = Ht(Dt, Pt, js, Sa, wi, Fs, ba);
(() => {
  const t = (
    /** @type {$Array<$any>} */
    ya(ms)
  ), e = (
    /** @type {$Record<$string,$any>} */
    fa(Pt, ms)
  ), n = Ht(Dt, Pt, js, Fs, t, e);
  return t.shape = n, e.shape.values = n, n;
})();
const gn = (t) => {
  if (bd.check(t))
    return (
      /** @type {any} */
      t
    );
  if (fd.check(t)) {
    const e = {};
    for (const n in t)
      e[n] = gn(t[n]);
    return (
      /** @type {any} */
      hd(e)
    );
  } else {
    if (md.check(t))
      return (
        /** @type {any} */
        Ht(...t.map(gn))
      );
    if (Dd.check(t))
      return (
        /** @type {any} */
        Ns(t)
      );
    if (Sd.check(t))
      return (
        /** @type {any} */
        $(
          /** @type {any} */
          t
        )
      );
  }
  ce();
}, xo = Bh ? () => {
} : (t, e) => {
  const n = new id();
  if (!e.check(t, n))
    throw Ce(`Expected value to be of type ${e.constructor.name}.
${n.toString()}`);
};
class Td {
  /**
   * @param {Schema<State>} [$state]
   */
  constructor(e) {
    this.patterns = [], this.$state = e;
  }
  /**
   * @template P
   * @template R
   * @param {P} pattern
   * @param {(o:NoInfer<Unwrap<ReadSchema<P>>>,s:State)=>R} handler
   * @return {PatternMatcher<State,Patterns|Pattern<Unwrap<ReadSchema<P>>,R>>}
   */
  if(e, n) {
    return this.patterns.push({ if: gn(e), h: n }), this;
  }
  /**
   * @template R
   * @param {(o:any,s:State)=>R} h
   */
  else(e) {
    return this.if(ms, e);
  }
  /**
   * @return {State extends undefined
   *   ? <In extends Unwrap<Patterns['if']>>(o:In,state?:undefined)=>PatternMatchResult<Patterns,In>
   *   : <In extends Unwrap<Patterns['if']>>(o:In,state:State)=>PatternMatchResult<Patterns,In>}
   */
  done() {
    return (
      /** @type {any} */
      (e, n) => {
        for (let s = 0; s < this.patterns.length; s++) {
          const r = this.patterns[s];
          if (r.if.check(e))
            return r.h(e, n);
        }
        throw Ce("Unhandled pattern");
      }
    );
  }
}
const Ld = (t) => new Td(
  /** @type {any} */
  t
), Ea = (
  /** @type {any} */
  Ld(
    /** @type {Schema<prng.PRNG>} */
    ms
  ).if(va, (t, e) => cr(e, mo, ps)).if(Ca, (t, e) => sd(e)).if(kd, (t, e) => ko(e)).if(Ad, (t, e) => BigInt(cr(e, mo, ps))).if(ys, (t, e) => St(e, ar(e, t.shape))).if(dd, (t, e) => {
    const n = {};
    for (const s in t.shape) {
      let r = t.shape[s];
      if (ld.check(r)) {
        if (ko(e))
          continue;
        r = r.shape;
      }
      n[s] = Ea(r, e);
    }
    return n;
  }).if(yd, (t, e) => {
    const n = [], s = aa(e, 0, 42);
    for (let r = 0; r < s; r++)
      n.push(St(e, t.shape));
    return n;
  }).if(la, (t, e) => ar(e, t.shape)).if(xd, (t, e) => null).if(Cd, (t, e) => {
    const n = St(e, t.res);
    return () => n;
  }).if(_d, (t, e) => St(e, ar(e, [
    Dt,
    Pt,
    js,
    Sa,
    wi,
    Fs,
    ya(Dt),
    fa(Ht("a", "b", "c"), Dt)
  ]))).if(pd, (t, e) => {
    const n = {}, s = cr(e, 0, 3);
    for (let r = 0; r < s; r++) {
      const i = St(e, t.shape.keys), o = St(e, t.shape.values);
      n[i] = o;
    }
    return n;
  }).done()
), St = (t, e) => (
  /** @type {any} */
  Ea(gn(e), t)
), Hs = (
  /** @type {Document} */
  typeof document < "u" ? document : {}
);
B((t) => t.nodeType === Pd);
typeof DOMParser < "u" && new DOMParser();
B((t) => t.nodeType === Md);
B((t) => t.nodeType === $d);
const Id = (t) => _h(t, (e, n) => `${n}:${e};`).join(""), Md = Hs.ELEMENT_NODE, $d = Hs.TEXT_NODE, Od = Hs.DOCUMENT_NODE, Pd = Hs.DOCUMENT_FRAGMENT_NODE;
B((t) => t.nodeType === Od);
const $e = Symbol, _a = $e(), Aa = $e(), Rd = $e(), Nd = $e(), Ud = $e(), ka = $e(), Fd = $e(), xa = $e(), jd = $e(), Hd = (t) => {
  t.length === 1 && t[0]?.constructor === Function && (t = /** @type {Array<string|Symbol|Object|number>} */
  /** @type {[function]} */
  t[0]());
  const e = [], n = [];
  let s = 0;
  for (; s < t.length; s++) {
    const r = t[s];
    if (r === void 0)
      break;
    if (r.constructor === String || r.constructor === Number)
      e.push(r);
    else if (r.constructor === Object)
      break;
  }
  for (s > 0 && n.push(e.join("")); s < t.length; s++) {
    const r = t[s];
    r instanceof Symbol || n.push(r);
  }
  return n;
}, zd = {
  [_a]: xe("font-weight", "bold"),
  [Aa]: xe("font-weight", "normal"),
  [Rd]: xe("color", "blue"),
  [Ud]: xe("color", "green"),
  [Nd]: xe("color", "grey"),
  [ka]: xe("color", "red"),
  [Fd]: xe("color", "purple"),
  [xa]: xe("color", "orange"),
  // not well supported in chrome when debugging node with inspector - TODO: deprecate
  [jd]: xe("color", "black")
}, Bd = (t) => {
  t.length === 1 && t[0]?.constructor === Function && (t = /** @type {Array<string|Symbol|Object|number>} */
  /** @type {[function]} */
  t[0]());
  const e = [], n = [], s = te();
  let r = [], i = 0;
  for (; i < t.length; i++) {
    const o = t[i], c = zd[o];
    if (c !== void 0)
      s.set(c.left, c.right);
    else {
      if (o === void 0)
        break;
      if (o.constructor === String || o.constructor === Number) {
        const a = Id(s);
        i > 0 || a.length > 0 ? (e.push("%c" + o), n.push(a)) : e.push(o);
      } else
        break;
    }
  }
  for (i > 0 && (r = n, r.unshift(e.join(""))); i < t.length; i++) {
    const o = t[i];
    o instanceof Symbol || r.push(o);
  }
  return r;
}, Vd = Kh ? Bd : Hd, Kd = (...t) => {
  console.log(...Vd(t)), Wd.forEach((e) => e.print(t));
}, Wd = Ve(), Da = (t) => ({
  /**
   * @return {IterableIterator<T>}
   */
  [Symbol.iterator]() {
    return this;
  },
  // @ts-ignore
  next: t
}), Yd = (t, e) => Da(() => {
  let n;
  do
    n = t.next();
  while (!n.done && !e(n.value));
  return n;
}), lr = (t, e) => Da(() => {
  const { done: n, value: s } = t.next();
  return { done: n, value: n ? void 0 : e(s) };
});
class bi {
  /**
   * @param {number} clock
   * @param {number} len
   */
  constructor(e, n) {
    this.clock = e, this.len = n;
  }
}
class On {
  constructor() {
    this.clients = /* @__PURE__ */ new Map();
  }
}
const Ta = (t, e, n) => e.clients.forEach((s, r) => {
  const i = (
    /** @type {Array<GC|Item>} */
    t.doc.store.clients.get(r)
  );
  for (let o = 0; o < s.length; o++) {
    const c = s[o];
    za(t, i, c.clock, c.len, n);
  }
}), Gd = (t, e) => {
  let n = 0, s = t.length - 1;
  for (; n <= s; ) {
    const r = pe((n + s) / 2), i = t[r], o = i.clock;
    if (o <= e) {
      if (e < o + i.len)
        return r;
      n = r + 1;
    } else
      s = r - 1;
  }
  return null;
}, La = (t, e) => {
  const n = t.clients.get(e.client);
  return n !== void 0 && Gd(n, e.clock) !== null;
}, vi = (t) => {
  t.clients.forEach((e) => {
    e.sort((r, i) => r.clock - i.clock);
    let n, s;
    for (n = 1, s = 1; n < e.length; n++) {
      const r = e[s - 1], i = e[n];
      r.clock + r.len >= i.clock ? r.len = vt(r.len, i.clock + i.len - r.clock) : (s < n && (e[s] = i), s++);
    }
    e.length = s;
  });
}, qd = (t) => {
  const e = new On();
  for (let n = 0; n < t.length; n++)
    t[n].clients.forEach((s, r) => {
      if (!e.clients.has(r)) {
        const i = s.slice();
        for (let o = n + 1; o < t.length; o++)
          Ju(i, t[o].clients.get(r) || []);
        e.clients.set(r, i);
      }
    });
  return vi(e), e;
}, ws = (t, e, n, s) => {
  ke(t.clients, e, () => (
    /** @type {Array<DeleteItem>} */
    []
  )).push(new bi(n, s));
}, Jd = () => new On(), Xd = (t) => {
  const e = Jd();
  return t.clients.forEach((n, s) => {
    const r = [];
    for (let i = 0; i < n.length; i++) {
      const o = n[i];
      if (o.deleted) {
        const c = o.id.clock;
        let a = o.length;
        if (i + 1 < n.length)
          for (let l = n[i + 1]; i + 1 < n.length && l.deleted; l = n[++i + 1])
            a += l.length;
        r.push(new bi(c, a));
      }
    }
    r.length > 0 && e.clients.set(s, r);
  }), e;
}, zt = (t, e) => {
  b(t.restEncoder, e.clients.size), Le(e.clients.entries()).sort((n, s) => s[0] - n[0]).forEach(([n, s]) => {
    t.resetDsCurVal(), b(t.restEncoder, n);
    const r = s.length;
    b(t.restEncoder, r);
    for (let i = 0; i < r; i++) {
      const o = s[i];
      t.writeDsClock(o.clock), t.writeDsLen(o.len);
    }
  });
}, Ci = (t) => {
  const e = new On(), n = S(t.restDecoder);
  for (let s = 0; s < n; s++) {
    t.resetDsCurVal();
    const r = S(t.restDecoder), i = S(t.restDecoder);
    if (i > 0) {
      const o = ke(e.clients, r, () => (
        /** @type {Array<DeleteItem>} */
        []
      ));
      for (let c = 0; c < i; c++)
        o.push(new bi(t.readDsClock(), t.readDsLen()));
    }
  }
  return e;
}, Do = (t, e, n) => {
  const s = new On(), r = S(t.restDecoder);
  for (let i = 0; i < r; i++) {
    t.resetDsCurVal();
    const o = S(t.restDecoder), c = S(t.restDecoder), a = n.clients.get(o) || [], l = j(n, o);
    for (let u = 0; u < c; u++) {
      const h = t.readDsClock(), d = h + t.readDsLen();
      if (h < l) {
        l < d && ws(s, o, l, d - l);
        let f = ge(a, h), p = a[f];
        for (!p.deleted && p.id.clock < h && (a.splice(f + 1, 0, Es(e, p, h - p.id.clock)), f++); f < a.length && (p = a[f++], p.id.clock < d); )
          p.deleted || (d < p.id.clock + p.length && a.splice(f, 0, Es(e, p, d - p.id.clock)), p.delete(e));
      } else
        ws(s, o, h, d - h);
    }
  }
  if (s.clients.size > 0) {
    const i = new ht();
    return b(i.restEncoder, 0), zt(i, s), i.toUint8Array();
  }
  return null;
}, Ia = na;
class me extends kh {
  /**
   * @param {DocOpts} opts configuration
   */
  constructor({ guid: e = Uh(), collectionid: n = null, gc: s = !0, gcFilter: r = () => !0, meta: i = null, autoLoad: o = !1, shouldLoad: c = !0 } = {}) {
    super(), this.gc = s, this.gcFilter = r, this.clientID = Ia(), this.guid = e, this.collectionid = n, this.share = /* @__PURE__ */ new Map(), this.store = new ja(), this._transaction = null, this._transactionCleanups = [], this.subdocs = /* @__PURE__ */ new Set(), this._item = null, this.shouldLoad = c, this.autoLoad = o, this.meta = i, this.isLoaded = !1, this.isSynced = !1, this.whenLoaded = _o((l) => {
      this.on("load", () => {
        this.isLoaded = !0, l(this);
      });
    });
    const a = () => _o((l) => {
      const u = (h) => {
        (h === void 0 || h === !0) && (this.off("sync", u), l());
      };
      this.on("sync", u);
    });
    this.on("sync", (l) => {
      l === !1 && this.isSynced && (this.whenSynced = a()), this.isSynced = l === void 0 || l === !0, this.isSynced && !this.isLoaded && this.emit("load", [this]);
    }), this.whenSynced = a();
  }
  /**
   * Notify the parent document that you request to load data into this subdocument (if it is a subdocument).
   *
   * `load()` might be used in the future to request any provider to load the most current data.
   *
   * It is safe to call `load()` multiple times.
   */
  load() {
    const e = this._item;
    e !== null && !this.shouldLoad && k(
      /** @type {any} */
      e.parent.doc,
      (n) => {
        n.subdocsLoaded.add(this);
      },
      null,
      !0
    ), this.shouldLoad = !0;
  }
  getSubdocs() {
    return this.subdocs;
  }
  getSubdocGuids() {
    return new Set(Le(this.subdocs).map((e) => e.guid));
  }
  /**
   * Changes that happen inside of a transaction are bundled. This means that
   * the observer fires _after_ the transaction is finished and that all changes
   * that happened inside of the transaction are sent as one message to the
   * other peers.
   *
   * @template T
   * @param {function(Transaction):T} f The function that should be executed as a transaction
   * @param {any} [origin] Origin of who started the transaction. Will be stored on transaction.origin
   * @return T
   *
   * @public
   */
  transact(e, n = null) {
    return k(this, e, n);
  }
  /**
   * Define a shared data type.
   *
   * Multiple calls of `ydoc.get(name, TypeConstructor)` yield the same result
   * and do not overwrite each other. I.e.
   * `ydoc.get(name, Y.Array) === ydoc.get(name, Y.Array)`
   *
   * After this method is called, the type is also available on `ydoc.share.get(name)`.
   *
   * *Best Practices:*
   * Define all types right after the Y.Doc instance is created and store them in a separate object.
   * Also use the typed methods `getText(name)`, `getArray(name)`, ..
   *
   * @template {typeof AbstractType<any>} Type
   * @example
   *   const ydoc = new Y.Doc(..)
   *   const appState = {
   *     document: ydoc.getText('document')
   *     comments: ydoc.getArray('comments')
   *   }
   *
   * @param {string} name
   * @param {Type} TypeConstructor The constructor of the type definition. E.g. Y.Text, Y.Array, Y.Map, ...
   * @return {InstanceType<Type>} The created type. Constructed with TypeConstructor
   *
   * @public
   */
  get(e, n = (
    /** @type {any} */
    L
  )) {
    const s = ke(this.share, e, () => {
      const i = new n();
      return i._integrate(this, null), i;
    }), r = s.constructor;
    if (n !== L && r !== n)
      if (r === L) {
        const i = new n();
        i._map = s._map, s._map.forEach(
          /** @param {Item?} n */
          (o) => {
            for (; o !== null; o = o.left)
              o.parent = i;
          }
        ), i._start = s._start;
        for (let o = i._start; o !== null; o = o.right)
          o.parent = i;
        return i._length = s._length, this.share.set(e, i), i._integrate(this, null), /** @type {InstanceType<Type>} */
        i;
      } else
        throw new Error(`Type with the name ${e} has already been defined with a different constructor`);
    return (
      /** @type {InstanceType<Type>} */
      s
    );
  }
  /**
   * @template T
   * @param {string} [name]
   * @return {YArray<T>}
   *
   * @public
   */
  getArray(e = "") {
    return (
      /** @type {YArray<T>} */
      this.get(e, be)
    );
  }
  /**
   * @param {string} [name]
   * @return {YText}
   *
   * @public
   */
  getText(e = "") {
    return this.get(e, Ie);
  }
  /**
   * @template T
   * @param {string} [name]
   * @return {YMap<T>}
   *
   * @public
   */
  getMap(e = "") {
    return (
      /** @type {YMap<T>} */
      this.get(e, Se)
    );
  }
  /**
   * @param {string} [name]
   * @return {YXmlElement}
   *
   * @public
   */
  getXmlElement(e = "") {
    return (
      /** @type {YXmlElement<{[key:string]:string}>} */
      this.get(e, Me)
    );
  }
  /**
   * @param {string} [name]
   * @return {YXmlFragment}
   *
   * @public
   */
  getXmlFragment(e = "") {
    return this.get(e, Ee);
  }
  /**
   * Converts the entire document into a js object, recursively traversing each yjs type
   * Doesn't log types that have not been defined (using ydoc.getType(..)).
   *
   * @deprecated Do not use this method and rather call toJSON directly on the shared types.
   *
   * @return {Object<string, any>}
   */
  toJSON() {
    const e = {};
    return this.share.forEach((n, s) => {
      e[s] = n.toJSON();
    }), e;
  }
  /**
   * Emit `destroy` event and unregister all event handlers.
   */
  destroy() {
    Le(this.subdocs).forEach((n) => n.destroy());
    const e = this._item;
    if (e !== null) {
      this._item = null;
      const n = (
        /** @type {ContentDoc} */
        e.content
      );
      n.doc = new me({ guid: this.guid, ...n.opts, shouldLoad: !1 }), n.doc._item = e, k(
        /** @type {any} */
        e.parent.doc,
        (s) => {
          const r = n.doc;
          e.deleted || s.subdocsAdded.add(r), s.subdocsRemoved.add(this);
        },
        null,
        !0
      );
    }
    this.emit("destroyed", [!0]), this.emit("destroy", [this]), super.destroy();
  }
}
class Ma {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor(e) {
    this.restDecoder = e;
  }
  resetDsCurVal() {
  }
  /**
   * @return {number}
   */
  readDsClock() {
    return S(this.restDecoder);
  }
  /**
   * @return {number}
   */
  readDsLen() {
    return S(this.restDecoder);
  }
}
class $a extends Ma {
  /**
   * @return {ID}
   */
  readLeftID() {
    return A(S(this.restDecoder), S(this.restDecoder));
  }
  /**
   * @return {ID}
   */
  readRightID() {
    return A(S(this.restDecoder), S(this.restDecoder));
  }
  /**
   * Read the next client id.
   * Use this in favor of readID whenever possible to reduce the number of objects created.
   */
  readClient() {
    return S(this.restDecoder);
  }
  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readInfo() {
    return Mt(this.restDecoder);
  }
  /**
   * @return {string}
   */
  readString() {
    return He(this.restDecoder);
  }
  /**
   * @return {boolean} isKey
   */
  readParentInfo() {
    return S(this.restDecoder) === 1;
  }
  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readTypeRef() {
    return S(this.restDecoder);
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @return {number} len
   */
  readLen() {
    return S(this.restDecoder);
  }
  /**
   * @return {any}
   */
  readAny() {
    return fn(this.restDecoder);
  }
  /**
   * @return {Uint8Array}
   */
  readBuf() {
    return ed(W(this.restDecoder));
  }
  /**
   * Legacy implementation uses JSON parse. We use any-decoding in v2.
   *
   * @return {any}
   */
  readJSON() {
    return JSON.parse(He(this.restDecoder));
  }
  /**
   * @return {string}
   */
  readKey() {
    return He(this.restDecoder);
  }
}
class Zd {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor(e) {
    this.dsCurrVal = 0, this.restDecoder = e;
  }
  resetDsCurVal() {
    this.dsCurrVal = 0;
  }
  /**
   * @return {number}
   */
  readDsClock() {
    return this.dsCurrVal += S(this.restDecoder), this.dsCurrVal;
  }
  /**
   * @return {number}
   */
  readDsLen() {
    const e = S(this.restDecoder) + 1;
    return this.dsCurrVal += e, e;
  }
}
class Rt extends Zd {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor(e) {
    super(e), this.keys = [], S(e), this.keyClockDecoder = new or(W(e)), this.clientDecoder = new as(W(e)), this.leftClockDecoder = new or(W(e)), this.rightClockDecoder = new or(W(e)), this.infoDecoder = new Eo(W(e), Mt), this.stringDecoder = new Eh(W(e)), this.parentInfoDecoder = new Eo(W(e), Mt), this.typeRefDecoder = new as(W(e)), this.lenDecoder = new as(W(e));
  }
  /**
   * @return {ID}
   */
  readLeftID() {
    return new Tt(this.clientDecoder.read(), this.leftClockDecoder.read());
  }
  /**
   * @return {ID}
   */
  readRightID() {
    return new Tt(this.clientDecoder.read(), this.rightClockDecoder.read());
  }
  /**
   * Read the next client id.
   * Use this in favor of readID whenever possible to reduce the number of objects created.
   */
  readClient() {
    return this.clientDecoder.read();
  }
  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readInfo() {
    return (
      /** @type {number} */
      this.infoDecoder.read()
    );
  }
  /**
   * @return {string}
   */
  readString() {
    return this.stringDecoder.read();
  }
  /**
   * @return {boolean}
   */
  readParentInfo() {
    return this.parentInfoDecoder.read() === 1;
  }
  /**
   * @return {number} An unsigned 8-bit integer
   */
  readTypeRef() {
    return this.typeRefDecoder.read();
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @return {number}
   */
  readLen() {
    return this.lenDecoder.read();
  }
  /**
   * @return {any}
   */
  readAny() {
    return fn(this.restDecoder);
  }
  /**
   * @return {Uint8Array}
   */
  readBuf() {
    return W(this.restDecoder);
  }
  /**
   * This is mainly here for legacy purposes.
   *
   * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
   *
   * @return {any}
   */
  readJSON() {
    return fn(this.restDecoder);
  }
  /**
   * @return {string}
   */
  readKey() {
    const e = this.keyClockDecoder.read();
    if (e < this.keys.length)
      return this.keys[e];
    {
      const n = this.stringDecoder.read();
      return this.keys.push(n), n;
    }
  }
}
class Oa {
  constructor() {
    this.restEncoder = Y();
  }
  toUint8Array() {
    return T(this.restEncoder);
  }
  resetDsCurVal() {
  }
  /**
   * @param {number} clock
   */
  writeDsClock(e) {
    b(this.restEncoder, e);
  }
  /**
   * @param {number} len
   */
  writeDsLen(e) {
    b(this.restEncoder, e);
  }
}
class Pn extends Oa {
  /**
   * @param {ID} id
   */
  writeLeftID(e) {
    b(this.restEncoder, e.client), b(this.restEncoder, e.clock);
  }
  /**
   * @param {ID} id
   */
  writeRightID(e) {
    b(this.restEncoder, e.client), b(this.restEncoder, e.clock);
  }
  /**
   * Use writeClient and writeClock instead of writeID if possible.
   * @param {number} client
   */
  writeClient(e) {
    b(this.restEncoder, e);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeInfo(e) {
    Lr(this.restEncoder, e);
  }
  /**
   * @param {string} s
   */
  writeString(e) {
    ct(this.restEncoder, e);
  }
  /**
   * @param {boolean} isYKey
   */
  writeParentInfo(e) {
    b(this.restEncoder, e ? 1 : 0);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeTypeRef(e) {
    b(this.restEncoder, e);
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @param {number} len
   */
  writeLen(e) {
    b(this.restEncoder, e);
  }
  /**
   * @param {any} any
   */
  writeAny(e) {
    dn(this.restEncoder, e);
  }
  /**
   * @param {Uint8Array} buf
   */
  writeBuf(e) {
    I(this.restEncoder, e);
  }
  /**
   * @param {any} embed
   */
  writeJSON(e) {
    ct(this.restEncoder, JSON.stringify(e));
  }
  /**
   * @param {string} key
   */
  writeKey(e) {
    ct(this.restEncoder, e);
  }
}
class Pa {
  constructor() {
    this.restEncoder = Y(), this.dsCurrVal = 0;
  }
  toUint8Array() {
    return T(this.restEncoder);
  }
  resetDsCurVal() {
    this.dsCurrVal = 0;
  }
  /**
   * @param {number} clock
   */
  writeDsClock(e) {
    const n = e - this.dsCurrVal;
    this.dsCurrVal = e, b(this.restEncoder, n);
  }
  /**
   * @param {number} len
   */
  writeDsLen(e) {
    e === 0 && ce(), b(this.restEncoder, e - 1), this.dsCurrVal += e;
  }
}
class ht extends Pa {
  constructor() {
    super(), this.keyMap = /* @__PURE__ */ new Map(), this.keyClock = 0, this.keyClockEncoder = new ir(), this.clientEncoder = new cs(), this.leftClockEncoder = new ir(), this.rightClockEncoder = new ir(), this.infoEncoder = new vo(Lr), this.stringEncoder = new ph(), this.parentInfoEncoder = new vo(Lr), this.typeRefEncoder = new cs(), this.lenEncoder = new cs();
  }
  toUint8Array() {
    const e = Y();
    return b(e, 0), I(e, this.keyClockEncoder.toUint8Array()), I(e, this.clientEncoder.toUint8Array()), I(e, this.leftClockEncoder.toUint8Array()), I(e, this.rightClockEncoder.toUint8Array()), I(e, T(this.infoEncoder)), I(e, this.stringEncoder.toUint8Array()), I(e, T(this.parentInfoEncoder)), I(e, this.typeRefEncoder.toUint8Array()), I(e, this.lenEncoder.toUint8Array()), Os(e, T(this.restEncoder)), T(e);
  }
  /**
   * @param {ID} id
   */
  writeLeftID(e) {
    this.clientEncoder.write(e.client), this.leftClockEncoder.write(e.clock);
  }
  /**
   * @param {ID} id
   */
  writeRightID(e) {
    this.clientEncoder.write(e.client), this.rightClockEncoder.write(e.clock);
  }
  /**
   * @param {number} client
   */
  writeClient(e) {
    this.clientEncoder.write(e);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeInfo(e) {
    this.infoEncoder.write(e);
  }
  /**
   * @param {string} s
   */
  writeString(e) {
    this.stringEncoder.write(e);
  }
  /**
   * @param {boolean} isYKey
   */
  writeParentInfo(e) {
    this.parentInfoEncoder.write(e ? 1 : 0);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeTypeRef(e) {
    this.typeRefEncoder.write(e);
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @param {number} len
   */
  writeLen(e) {
    this.lenEncoder.write(e);
  }
  /**
   * @param {any} any
   */
  writeAny(e) {
    dn(this.restEncoder, e);
  }
  /**
   * @param {Uint8Array} buf
   */
  writeBuf(e) {
    I(this.restEncoder, e);
  }
  /**
   * This is mainly here for legacy purposes.
   *
   * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
   *
   * @param {any} embed
   */
  writeJSON(e) {
    dn(this.restEncoder, e);
  }
  /**
   * Property keys are often reused. For example, in y-prosemirror the key `bold` might
   * occur very often. For a 3d application, the key `position` might occur very often.
   *
   * We cache these keys in a Map and refer to them via a unique number.
   *
   * @param {string} key
   */
  writeKey(e) {
    const n = this.keyMap.get(e);
    n === void 0 ? (this.keyClockEncoder.write(this.keyClock++), this.stringEncoder.write(e)) : this.keyClockEncoder.write(n);
  }
}
const Qd = (t, e, n, s) => {
  s = vt(s, e[0].id.clock);
  const r = ge(e, s);
  b(t.restEncoder, e.length - r), t.writeClient(n), b(t.restEncoder, s);
  const i = e[r];
  i.write(t, s - i.id.clock);
  for (let o = r + 1; o < e.length; o++)
    e[o].write(t, 0);
}, Si = (t, e, n) => {
  const s = /* @__PURE__ */ new Map();
  n.forEach((r, i) => {
    j(e, i) > r && s.set(i, r);
  }), zs(e).forEach((r, i) => {
    n.has(i) || s.set(i, 0);
  }), b(t.restEncoder, s.size), Le(s.entries()).sort((r, i) => i[0] - r[0]).forEach(([r, i]) => {
    Qd(
      t,
      /** @type {Array<GC|Item>} */
      e.clients.get(r),
      r,
      i
    );
  });
}, ef = (t, e) => {
  const n = te(), s = S(t.restDecoder);
  for (let r = 0; r < s; r++) {
    const i = S(t.restDecoder), o = new Array(i), c = t.readClient();
    let a = S(t.restDecoder);
    n.set(c, { i: 0, refs: o });
    for (let l = 0; l < i; l++) {
      const u = t.readInfo();
      switch (Ms & u) {
        case 0: {
          const h = t.readLen();
          o[l] = new re(A(c, a), h), a += h;
          break;
        }
        case 10: {
          const h = S(t.restDecoder);
          o[l] = new oe(A(c, a), h), a += h;
          break;
        }
        default: {
          const h = (u & (De | ie)) === 0, d = new P(
            A(c, a),
            null,
            // left
            (u & ie) === ie ? t.readLeftID() : null,
            // origin
            null,
            // right
            (u & De) === De ? t.readRightID() : null,
            // right origin
            h ? t.readParentInfo() ? e.get(t.readString()) : t.readLeftID() : null,
            // parent
            h && (u & un) === un ? t.readString() : null,
            // parentSub
            cl(t, u)
            // item content
          );
          o[l] = d, a += d.length;
        }
      }
    }
  }
  return n;
}, tf = (t, e, n) => {
  const s = [];
  let r = Le(n.keys()).sort((f, p) => f - p);
  if (r.length === 0)
    return null;
  const i = () => {
    if (r.length === 0)
      return null;
    let f = (
      /** @type {{i:number,refs:Array<GC|Item>}} */
      n.get(r[r.length - 1])
    );
    for (; f.refs.length === f.i; )
      if (r.pop(), r.length > 0)
        f = /** @type {{i:number,refs:Array<GC|Item>}} */
        n.get(r[r.length - 1]);
      else
        return null;
    return f;
  };
  let o = i();
  if (o === null)
    return null;
  const c = new ja(), a = /* @__PURE__ */ new Map(), l = (f, p) => {
    const g = a.get(f);
    (g == null || g > p) && a.set(f, p);
  };
  let u = (
    /** @type {any} */
    o.refs[
      /** @type {any} */
      o.i++
    ]
  );
  const h = /* @__PURE__ */ new Map(), d = () => {
    for (const f of s) {
      const p = f.id.client, g = n.get(p);
      g ? (g.i--, c.clients.set(p, g.refs.slice(g.i)), n.delete(p), g.i = 0, g.refs = []) : c.clients.set(p, [f]), r = r.filter((m) => m !== p);
    }
    s.length = 0;
  };
  for (; ; ) {
    if (u.constructor !== oe) {
      const p = ke(h, u.id.client, () => j(e, u.id.client)) - u.id.clock;
      if (p < 0)
        s.push(u), l(u.id.client, u.id.clock - 1), d();
      else {
        const g = u.getMissing(t, e);
        if (g !== null) {
          s.push(u);
          const m = n.get(
            /** @type {number} */
            g
          ) || { refs: [], i: 0 };
          if (m.refs.length === m.i)
            l(
              /** @type {number} */
              g,
              j(e, g)
            ), d();
          else {
            u = m.refs[m.i++];
            continue;
          }
        } else (p === 0 || p < u.length) && (u.integrate(t, p), h.set(u.id.client, u.id.clock + u.length));
      }
    }
    if (s.length > 0)
      u = /** @type {GC|Item} */
      s.pop();
    else if (o !== null && o.i < o.refs.length)
      u = /** @type {GC|Item} */
      o.refs[o.i++];
    else {
      if (o = i(), o === null)
        break;
      u = /** @type {GC|Item} */
      o.refs[o.i++];
    }
  }
  if (c.clients.size > 0) {
    const f = new ht();
    return Si(f, c, /* @__PURE__ */ new Map()), b(f.restEncoder, 0), { missing: a, update: f.toUint8Array() };
  }
  return null;
}, nf = (t, e) => Si(t, e.doc.store, e.beforeState), sf = (t, e, n, s = new Rt(t)) => k(e, (r) => {
  r.local = !1;
  let i = !1;
  const o = r.doc, c = o.store, a = ef(s, o), l = tf(r, c, a), u = c.pendingStructs;
  if (u) {
    for (const [d, f] of u.missing)
      if (f < j(c, d)) {
        i = !0;
        break;
      }
    if (l) {
      for (const [d, f] of l.missing) {
        const p = u.missing.get(d);
        (p == null || p > f) && u.missing.set(d, f);
      }
      u.update = bs([u.update, l.update]);
    }
  } else
    c.pendingStructs = l;
  const h = Do(s, r, c);
  if (c.pendingDs) {
    const d = new Rt(qe(c.pendingDs));
    S(d.restDecoder);
    const f = Do(d, r, c);
    h && f ? c.pendingDs = bs([h, f]) : c.pendingDs = h || f;
  } else
    c.pendingDs = h;
  if (i) {
    const d = (
      /** @type {{update: Uint8Array}} */
      c.pendingStructs.update
    );
    c.pendingStructs = null, Ra(r.doc, d);
  }
}, n, !1), Ra = (t, e, n, s = Rt) => {
  const r = qe(e);
  sf(r, t, n, new s(r));
}, rf = (t, e, n) => Ra(t, e, n, $a), of = (t, e, n = /* @__PURE__ */ new Map()) => {
  Si(t, e.store, n), zt(t, Xd(e.store));
}, cf = (t, e = new Uint8Array([0]), n = new ht()) => {
  const s = Na(e);
  of(n, t, s);
  const r = [n.toUint8Array()];
  if (t.store.pendingDs && r.push(t.store.pendingDs), t.store.pendingStructs && r.push(Ef(t.store.pendingStructs.update, e)), r.length > 1) {
    if (n.constructor === Pn)
      return Cf(r.map((i, o) => o === 0 ? i : Af(i)));
    if (n.constructor === ht)
      return bs(r);
  }
  return r[0];
}, af = (t, e) => cf(t, e, new Pn()), lf = (t) => {
  const e = /* @__PURE__ */ new Map(), n = S(t.restDecoder);
  for (let s = 0; s < n; s++) {
    const r = S(t.restDecoder), i = S(t.restDecoder);
    e.set(r, i);
  }
  return e;
}, Na = (t) => lf(new Ma(qe(t))), Ua = (t, e) => (b(t.restEncoder, e.size), Le(e.entries()).sort((n, s) => s[0] - n[0]).forEach(([n, s]) => {
  b(t.restEncoder, n), b(t.restEncoder, s);
}), t), uf = (t, e) => Ua(t, zs(e.store)), hf = (t, e = new Pa()) => (t instanceof Map ? Ua(e, t) : uf(e, t), e.toUint8Array()), df = (t) => hf(t, new Oa());
class ff {
  constructor() {
    this.l = [];
  }
}
const To = () => new ff(), Lo = (t, e) => t.l.push(e), Io = (t, e) => {
  const n = t.l, s = n.length;
  t.l = n.filter((r) => e !== r), s === t.l.length && console.error("[yjs] Tried to remove event handler that doesn't exist.");
}, Fa = (t, e, n) => di(t.l, [e, n]);
class Tt {
  /**
   * @param {number} client client id
   * @param {number} clock unique per client id, continuous number
   */
  constructor(e, n) {
    this.client = e, this.clock = n;
  }
}
const Wn = (t, e) => t === e || t !== null && e !== null && t.client === e.client && t.clock === e.clock, A = (t, e) => new Tt(t, e), pf = (t) => {
  for (const [e, n] of t.doc.share.entries())
    if (n === t)
      return e;
  throw ce();
}, _t = (t, e) => e === void 0 ? !t.deleted : e.sv.has(t.id.client) && (e.sv.get(t.id.client) || 0) > t.id.clock && !La(e.ds, t.id), Rr = (t, e) => {
  const n = ke(t.meta, Rr, Ve), s = t.doc.store;
  n.has(e) || (e.sv.forEach((r, i) => {
    r < j(s, i) && Ke(t, A(i, r));
  }), Ta(t, e.ds, (r) => {
  }), n.add(e));
};
class ja {
  constructor() {
    this.clients = /* @__PURE__ */ new Map(), this.pendingStructs = null, this.pendingDs = null;
  }
}
const zs = (t) => {
  const e = /* @__PURE__ */ new Map();
  return t.clients.forEach((n, s) => {
    const r = n[n.length - 1];
    e.set(s, r.id.clock + r.length);
  }), e;
}, j = (t, e) => {
  const n = t.clients.get(e);
  if (n === void 0)
    return 0;
  const s = n[n.length - 1];
  return s.id.clock + s.length;
}, Ha = (t, e) => {
  let n = t.clients.get(e.id.client);
  if (n === void 0)
    n = [], t.clients.set(e.id.client, n);
  else {
    const s = n[n.length - 1];
    if (s.id.clock + s.length !== e.id.clock)
      throw ce();
  }
  n.push(e);
}, ge = (t, e) => {
  let n = 0, s = t.length - 1, r = t[s], i = r.id.clock;
  if (i === e)
    return s;
  let o = pe(e / (i + r.length - 1) * s);
  for (; n <= s; ) {
    if (r = t[o], i = r.id.clock, i <= e) {
      if (e < i + r.length)
        return o;
      n = o + 1;
    } else
      s = o - 1;
    o = pe((n + s) / 2);
  }
  throw ce();
}, gf = (t, e) => {
  const n = t.clients.get(e.client);
  return n[ge(n, e.clock)];
}, ur = (
  /** @type {function(StructStore,ID):Item} */
  gf
), Nr = (t, e, n) => {
  const s = ge(e, n), r = e[s];
  return r.id.clock < n && r instanceof P ? (e.splice(s + 1, 0, Es(t, r, n - r.id.clock)), s + 1) : s;
}, Ke = (t, e) => {
  const n = (
    /** @type {Array<Item>} */
    t.doc.store.clients.get(e.client)
  );
  return n[Nr(t, n, e.clock)];
}, Mo = (t, e, n) => {
  const s = e.clients.get(n.client), r = ge(s, n.clock), i = s[r];
  return n.clock !== i.id.clock + i.length - 1 && i.constructor !== re && s.splice(r + 1, 0, Es(t, i, n.clock - i.id.clock + 1)), i;
}, yf = (t, e, n) => {
  const s = (
    /** @type {Array<GC|Item>} */
    t.clients.get(e.id.client)
  );
  s[ge(s, e.id.clock)] = n;
}, za = (t, e, n, s, r) => {
  if (s === 0)
    return;
  const i = n + s;
  let o = Nr(t, e, n), c;
  do
    c = e[o++], i < c.id.clock + c.length && Nr(t, e, i), r(c);
  while (o < e.length && e[o].id.clock < i);
};
class mf {
  /**
   * @param {Doc} doc
   * @param {any} origin
   * @param {boolean} local
   */
  constructor(e, n, s) {
    this.doc = e, this.deleteSet = new On(), this.beforeState = zs(e.store), this.afterState = /* @__PURE__ */ new Map(), this.changed = /* @__PURE__ */ new Map(), this.changedParentTypes = /* @__PURE__ */ new Map(), this._mergeStructs = [], this.origin = n, this.meta = /* @__PURE__ */ new Map(), this.local = s, this.subdocsAdded = /* @__PURE__ */ new Set(), this.subdocsRemoved = /* @__PURE__ */ new Set(), this.subdocsLoaded = /* @__PURE__ */ new Set(), this._needFormattingCleanup = !1;
  }
}
const $o = (t, e) => e.deleteSet.clients.size === 0 && !Ah(e.afterState, (n, s) => e.beforeState.get(s) !== n) ? !1 : (vi(e.deleteSet), nf(t, e), zt(t, e.deleteSet), !0), Oo = (t, e, n) => {
  const s = e._item;
  (s === null || s.id.clock < (t.beforeState.get(s.id.client) || 0) && !s.deleted) && ke(t.changed, e, Ve).add(n);
}, ls = (t, e) => {
  let n = t[e], s = t[e - 1], r = e;
  for (; r > 0; n = s, s = t[--r - 1]) {
    if (s.deleted === n.deleted && s.constructor === n.constructor && s.mergeWith(n)) {
      n instanceof P && n.parentSub !== null && /** @type {AbstractType<any>} */
      n.parent._map.get(n.parentSub) === n && n.parent._map.set(
        n.parentSub,
        /** @type {Item} */
        s
      );
      continue;
    }
    break;
  }
  const i = e - r;
  return i && t.splice(e + 1 - i, i), i;
}, wf = (t, e, n) => {
  for (const [s, r] of t.clients.entries()) {
    const i = (
      /** @type {Array<GC|Item>} */
      e.clients.get(s)
    );
    for (let o = r.length - 1; o >= 0; o--) {
      const c = r[o], a = c.clock + c.len;
      for (let l = ge(i, c.clock), u = i[l]; l < i.length && u.id.clock < a; u = i[++l]) {
        const h = i[l];
        if (c.clock + c.len <= h.id.clock)
          break;
        h instanceof P && h.deleted && !h.keep && n(h) && h.gc(e, !1);
      }
    }
  }
}, bf = (t, e) => {
  t.clients.forEach((n, s) => {
    const r = (
      /** @type {Array<GC|Item>} */
      e.clients.get(s)
    );
    for (let i = n.length - 1; i >= 0; i--) {
      const o = n[i], c = ri(r.length - 1, 1 + ge(r, o.clock + o.len - 1));
      for (let a = c, l = r[a]; a > 0 && l.id.clock >= o.clock; l = r[a])
        a -= 1 + ls(r, a);
    }
  });
}, Ba = (t, e) => {
  if (e < t.length) {
    const n = t[e], s = n.doc, r = s.store, i = n.deleteSet, o = n._mergeStructs;
    try {
      vi(i), n.afterState = zs(n.doc.store), s.emit("beforeObserverCalls", [n, s]);
      const c = [];
      n.changed.forEach(
        (a, l) => c.push(() => {
          (l._item === null || !l._item.deleted) && l._callObserver(n, a);
        })
      ), c.push(() => {
        n.changedParentTypes.forEach((a, l) => {
          l._dEH.l.length > 0 && (l._item === null || !l._item.deleted) && (a = a.filter(
            (u) => u.target._item === null || !u.target._item.deleted
          ), a.forEach((u) => {
            u.currentTarget = l, u._path = null;
          }), a.sort((u, h) => u.path.length - h.path.length), Fa(l._dEH, a, n));
        });
      }), c.push(() => s.emit("afterTransaction", [n, s])), di(c, []), n._needFormattingCleanup && Ff(n);
    } finally {
      s.gc && wf(i, r, s.gcFilter), bf(i, r), n.afterState.forEach((u, h) => {
        const d = n.beforeState.get(h) || 0;
        if (d !== u) {
          const f = (
            /** @type {Array<GC|Item>} */
            r.clients.get(h)
          ), p = vt(ge(f, d), 1);
          for (let g = f.length - 1; g >= p; )
            g -= 1 + ls(f, g);
        }
      });
      for (let u = o.length - 1; u >= 0; u--) {
        const { client: h, clock: d } = o[u].id, f = (
          /** @type {Array<GC|Item>} */
          r.clients.get(h)
        ), p = ge(f, d);
        p + 1 < f.length && ls(f, p + 1) > 1 || p > 0 && ls(f, p);
      }
      if (!n.local && n.afterState.get(s.clientID) !== n.beforeState.get(s.clientID) && (Kd(xa, _a, "[yjs] ", Aa, ka, "Changed the client-id because another client seems to be using it."), s.clientID = Ia()), s.emit("afterTransactionCleanup", [n, s]), s._observers.has("update")) {
        const u = new Pn();
        $o(u, n) && s.emit("update", [u.toUint8Array(), n.origin, s, n]);
      }
      if (s._observers.has("updateV2")) {
        const u = new ht();
        $o(u, n) && s.emit("updateV2", [u.toUint8Array(), n.origin, s, n]);
      }
      const { subdocsAdded: c, subdocsLoaded: a, subdocsRemoved: l } = n;
      (c.size > 0 || l.size > 0 || a.size > 0) && (c.forEach((u) => {
        u.clientID = s.clientID, u.collectionid == null && (u.collectionid = s.collectionid), s.subdocs.add(u);
      }), l.forEach((u) => s.subdocs.delete(u)), s.emit("subdocs", [{ loaded: a, added: c, removed: l }, s, n]), l.forEach((u) => u.destroy())), t.length <= e + 1 ? (s._transactionCleanups = [], s.emit("afterAllTransactions", [s, t])) : Ba(t, e + 1);
    }
  }
}, k = (t, e, n = null, s = !0) => {
  const r = t._transactionCleanups;
  let i = !1, o = null;
  t._transaction === null && (i = !0, t._transaction = new mf(t, n, s), r.push(t._transaction), r.length === 1 && t.emit("beforeAllTransactions", [t]), t.emit("beforeTransaction", [t._transaction, t]));
  try {
    o = e(t._transaction);
  } finally {
    if (i) {
      const c = t._transaction === r[0];
      t._transaction = null, c && Ba(r, 0);
    }
  }
  return o;
};
function* vf(t) {
  const e = S(t.restDecoder);
  for (let n = 0; n < e; n++) {
    const s = S(t.restDecoder), r = t.readClient();
    let i = S(t.restDecoder);
    for (let o = 0; o < s; o++) {
      const c = t.readInfo();
      if (c === 10) {
        const a = S(t.restDecoder);
        yield new oe(A(r, i), a), i += a;
      } else if ((Ms & c) !== 0) {
        const a = (c & (De | ie)) === 0, l = new P(
          A(r, i),
          null,
          // left
          (c & ie) === ie ? t.readLeftID() : null,
          // origin
          null,
          // right
          (c & De) === De ? t.readRightID() : null,
          // right origin
          // @ts-ignore Force writing a string here.
          a ? t.readParentInfo() ? t.readString() : t.readLeftID() : null,
          // parent
          a && (c & un) === un ? t.readString() : null,
          // parentSub
          cl(t, c)
          // item content
        );
        yield l, i += l.length;
      } else {
        const a = t.readLen();
        yield new re(A(r, i), a), i += a;
      }
    }
  }
}
class Ei {
  /**
   * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
   * @param {boolean} filterSkips
   */
  constructor(e, n) {
    this.gen = vf(e), this.curr = null, this.done = !1, this.filterSkips = n, this.next();
  }
  /**
   * @return {Item | GC | Skip |null}
   */
  next() {
    do
      this.curr = this.gen.next().value || null;
    while (this.filterSkips && this.curr !== null && this.curr.constructor === oe);
    return this.curr;
  }
}
class _i {
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  constructor(e) {
    this.currClient = 0, this.startClock = 0, this.written = 0, this.encoder = e, this.clientStructs = [];
  }
}
const Cf = (t) => bs(t, $a, Pn), Sf = (t, e) => {
  if (t.constructor === re) {
    const { client: n, clock: s } = t.id;
    return new re(A(n, s + e), t.length - e);
  } else if (t.constructor === oe) {
    const { client: n, clock: s } = t.id;
    return new oe(A(n, s + e), t.length - e);
  } else {
    const n = (
      /** @type {Item} */
      t
    ), { client: s, clock: r } = n.id;
    return new P(
      A(s, r + e),
      null,
      A(s, r + e - 1),
      null,
      n.rightOrigin,
      n.parent,
      n.parentSub,
      n.content.splice(e)
    );
  }
}, bs = (t, e = Rt, n = ht) => {
  if (t.length === 1)
    return t[0];
  const s = t.map((u) => new e(qe(u)));
  let r = s.map((u) => new Ei(u, !0)), i = null;
  const o = new n(), c = new _i(o);
  for (; r = r.filter((d) => d.curr !== null), r.sort(
    /** @type {function(any,any):number} */
    (d, f) => {
      if (d.curr.id.client === f.curr.id.client) {
        const p = d.curr.id.clock - f.curr.id.clock;
        return p === 0 ? d.curr.constructor === f.curr.constructor ? 0 : d.curr.constructor === oe ? 1 : -1 : p;
      } else
        return f.curr.id.client - d.curr.id.client;
    }
  ), r.length !== 0; ) {
    const u = r[0], h = (
      /** @type {Item | GC} */
      u.curr.id.client
    );
    if (i !== null) {
      let d = (
        /** @type {Item | GC | null} */
        u.curr
      ), f = !1;
      for (; d !== null && d.id.clock + d.length <= i.struct.id.clock + i.struct.length && d.id.client >= i.struct.id.client; )
        d = u.next(), f = !0;
      if (d === null || // current decoder is empty
      d.id.client !== h || // check whether there is another decoder that has has updates from `firstClient`
      f && d.id.clock > i.struct.id.clock + i.struct.length)
        continue;
      if (h !== i.struct.id.client)
        Ne(c, i.struct, i.offset), i = { struct: d, offset: 0 }, u.next();
      else if (i.struct.id.clock + i.struct.length < d.id.clock)
        if (i.struct.constructor === oe)
          i.struct.length = d.id.clock + d.length - i.struct.id.clock;
        else {
          Ne(c, i.struct, i.offset);
          const p = d.id.clock - i.struct.id.clock - i.struct.length;
          i = { struct: new oe(A(h, i.struct.id.clock + i.struct.length), p), offset: 0 };
        }
      else {
        const p = i.struct.id.clock + i.struct.length - d.id.clock;
        p > 0 && (i.struct.constructor === oe ? i.struct.length -= p : d = Sf(d, p)), i.struct.mergeWith(
          /** @type {any} */
          d
        ) || (Ne(c, i.struct, i.offset), i = { struct: d, offset: 0 }, u.next());
      }
    } else
      i = { struct: (
        /** @type {Item | GC} */
        u.curr
      ), offset: 0 }, u.next();
    for (let d = u.curr; d !== null && d.id.client === h && d.id.clock === i.struct.id.clock + i.struct.length && d.constructor !== oe; d = u.next())
      Ne(c, i.struct, i.offset), i = { struct: d, offset: 0 };
  }
  i !== null && (Ne(c, i.struct, i.offset), i = null), Ai(c);
  const a = s.map((u) => Ci(u)), l = qd(a);
  return zt(o, l), o.toUint8Array();
}, Ef = (t, e, n = Rt, s = ht) => {
  const r = Na(e), i = new s(), o = new _i(i), c = new n(qe(t)), a = new Ei(c, !1);
  for (; a.curr; ) {
    const u = a.curr, h = u.id.client, d = r.get(h) || 0;
    if (a.curr.constructor === oe) {
      a.next();
      continue;
    }
    if (u.id.clock + u.length > d)
      for (Ne(o, u, vt(d - u.id.clock, 0)), a.next(); a.curr && a.curr.id.client === h; )
        Ne(o, a.curr, 0), a.next();
    else
      for (; a.curr && a.curr.id.client === h && a.curr.id.clock + a.curr.length <= d; )
        a.next();
  }
  Ai(o);
  const l = Ci(c);
  return zt(i, l), i.toUint8Array();
}, Va = (t) => {
  t.written > 0 && (t.clientStructs.push({ written: t.written, restEncoder: T(t.encoder.restEncoder) }), t.encoder.restEncoder = Y(), t.written = 0);
}, Ne = (t, e, n) => {
  t.written > 0 && t.currClient !== e.id.client && Va(t), t.written === 0 && (t.currClient = e.id.client, t.encoder.writeClient(e.id.client), b(t.encoder.restEncoder, e.id.clock + n)), e.write(t.encoder, n), t.written++;
}, Ai = (t) => {
  Va(t);
  const e = t.encoder.restEncoder;
  b(e, t.clientStructs.length);
  for (let n = 0; n < t.clientStructs.length; n++) {
    const s = t.clientStructs[n];
    b(e, s.written), Os(e, s.restEncoder);
  }
}, _f = (t, e, n, s) => {
  const r = new n(qe(t)), i = new Ei(r, !1), o = new s(), c = new _i(o);
  for (let l = i.curr; l !== null; l = i.next())
    Ne(c, e(l), 0);
  Ai(c);
  const a = Ci(r);
  return zt(o, a), o.toUint8Array();
}, Af = (t) => _f(t, Oh, Rt, Pn), Po = "You must not compute changes after the event-handler fired.";
class Bs {
  /**
   * @param {T} target The changed type.
   * @param {Transaction} transaction
   */
  constructor(e, n) {
    this.target = e, this.currentTarget = e, this.transaction = n, this._changes = null, this._keys = null, this._delta = null, this._path = null;
  }
  /**
   * Computes the path from `y` to the changed type.
   *
   * @todo v14 should standardize on path: Array<{parent, index}> because that is easier to work with.
   *
   * The following property holds:
   * @example
   *   let type = y
   *   event.path.forEach(dir => {
   *     type = type.get(dir)
   *   })
   *   type === event.target // => true
   */
  get path() {
    return this._path || (this._path = kf(this.currentTarget, this.target));
  }
  /**
   * Check if a struct is deleted by this event.
   *
   * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
   *
   * @param {AbstractStruct} struct
   * @return {boolean}
   */
  deletes(e) {
    return La(this.transaction.deleteSet, e.id);
  }
  /**
   * @type {Map<string, { action: 'add' | 'update' | 'delete', oldValue: any, newValue: any }>}
   */
  get keys() {
    if (this._keys === null) {
      if (this.transaction.doc._transactionCleanups.length === 0)
        throw Ce(Po);
      const e = /* @__PURE__ */ new Map(), n = this.target;
      /** @type Set<string|null> */
      this.transaction.changed.get(n).forEach((r) => {
        if (r !== null) {
          const i = (
            /** @type {Item} */
            n._map.get(r)
          );
          let o, c;
          if (this.adds(i)) {
            let a = i.left;
            for (; a !== null && this.adds(a); )
              a = a.left;
            if (this.deletes(i))
              if (a !== null && this.deletes(a))
                o = "delete", c = rr(a.content.getContent());
              else
                return;
            else
              a !== null && this.deletes(a) ? (o = "update", c = rr(a.content.getContent())) : (o = "add", c = void 0);
          } else if (this.deletes(i))
            o = "delete", c = rr(
              /** @type {Item} */
              i.content.getContent()
            );
          else
            return;
          e.set(r, { action: o, oldValue: c });
        }
      }), this._keys = e;
    }
    return this._keys;
  }
  /**
   * This is a computed property. Note that this can only be safely computed during the
   * event call. Computing this property after other changes happened might result in
   * unexpected behavior (incorrect computation of deltas). A safe way to collect changes
   * is to store the `changes` or the `delta` object. Avoid storing the `transaction` object.
   *
   * @type {Array<{insert?: string | Array<any> | object | AbstractType<any>, retain?: number, delete?: number, attributes?: Object<string, any>}>}
   */
  get delta() {
    return this.changes.delta;
  }
  /**
   * Check if a struct is added by this event.
   *
   * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
   *
   * @param {AbstractStruct} struct
   * @return {boolean}
   */
  adds(e) {
    return e.id.clock >= (this.transaction.beforeState.get(e.id.client) || 0);
  }
  /**
   * This is a computed property. Note that this can only be safely computed during the
   * event call. Computing this property after other changes happened might result in
   * unexpected behavior (incorrect computation of deltas). A safe way to collect changes
   * is to store the `changes` or the `delta` object. Avoid storing the `transaction` object.
   *
   * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string, delete?:number, retain?:number}>}}
   */
  get changes() {
    let e = this._changes;
    if (e === null) {
      if (this.transaction.doc._transactionCleanups.length === 0)
        throw Ce(Po);
      const n = this.target, s = Ve(), r = Ve(), i = [];
      if (e = {
        added: s,
        deleted: r,
        delta: i,
        keys: this.keys
      }, /** @type Set<string|null> */
      this.transaction.changed.get(n).has(null)) {
        let c = null;
        const a = () => {
          c && i.push(c);
        };
        for (let l = n._start; l !== null; l = l.right)
          l.deleted ? this.deletes(l) && !this.adds(l) && ((c === null || c.delete === void 0) && (a(), c = { delete: 0 }), c.delete += l.length, r.add(l)) : this.adds(l) ? ((c === null || c.insert === void 0) && (a(), c = { insert: [] }), c.insert = c.insert.concat(l.content.getContent()), s.add(l)) : ((c === null || c.retain === void 0) && (a(), c = { retain: 0 }), c.retain += l.length);
        c !== null && c.retain === void 0 && a();
      }
      this._changes = e;
    }
    return (
      /** @type {any} */
      e
    );
  }
}
const kf = (t, e) => {
  const n = [];
  for (; e._item !== null && e !== t; ) {
    if (e._item.parentSub !== null)
      n.unshift(e._item.parentSub);
    else {
      let s = 0, r = (
        /** @type {AbstractType<any>} */
        e._item.parent._start
      );
      for (; r !== e._item && r !== null; )
        !r.deleted && r.countable && (s += r.length), r = r.right;
      n.unshift(s);
    }
    e = /** @type {AbstractType<any>} */
    e._item.parent;
  }
  return n;
}, Ka = 80;
let ki = 0;
class xf {
  /**
   * @param {Item} p
   * @param {number} index
   */
  constructor(e, n) {
    e.marker = !0, this.p = e, this.index = n, this.timestamp = ki++;
  }
}
const Df = (t) => {
  t.timestamp = ki++;
}, Wa = (t, e, n) => {
  t.p.marker = !1, t.p = e, e.marker = !0, t.index = n, t.timestamp = ki++;
}, Tf = (t, e, n) => {
  if (t.length >= Ka) {
    const s = t.reduce((r, i) => r.timestamp < i.timestamp ? r : i);
    return Wa(s, e, n), s;
  } else {
    const s = new xf(e, n);
    return t.push(s), s;
  }
}, Vs = (t, e) => {
  if (t._start === null || e === 0 || t._searchMarker === null)
    return null;
  const n = t._searchMarker.length === 0 ? null : t._searchMarker.reduce((i, o) => os(e - i.index) < os(e - o.index) ? i : o);
  let s = t._start, r = 0;
  for (n !== null && (s = n.p, r = n.index, Df(n)); s.right !== null && r < e; ) {
    if (!s.deleted && s.countable) {
      if (e < r + s.length)
        break;
      r += s.length;
    }
    s = s.right;
  }
  for (; s.left !== null && r > e; )
    s = s.left, !s.deleted && s.countable && (r -= s.length);
  for (; s.left !== null && s.left.id.client === s.id.client && s.left.id.clock + s.left.length === s.id.clock; )
    s = s.left, !s.deleted && s.countable && (r -= s.length);
  return n !== null && os(n.index - r) < /** @type {YText|YArray<any>} */
  s.parent.length / Ka ? (Wa(n, s, r), n) : Tf(t._searchMarker, s, r);
}, yn = (t, e, n) => {
  for (let s = t.length - 1; s >= 0; s--) {
    const r = t[s];
    if (n > 0) {
      let i = r.p;
      for (i.marker = !1; i && (i.deleted || !i.countable); )
        i = i.left, i && !i.deleted && i.countable && (r.index -= i.length);
      if (i === null || i.marker === !0) {
        t.splice(s, 1);
        continue;
      }
      r.p = i, i.marker = !0;
    }
    (e < r.index || n > 0 && e === r.index) && (r.index = vt(e, r.index + n));
  }
}, Ks = (t, e, n) => {
  const s = t, r = e.changedParentTypes;
  for (; ke(r, t, () => []).push(n), t._item !== null; )
    t = /** @type {AbstractType<any>} */
    t._item.parent;
  Fa(s._eH, n, e);
};
class L {
  constructor() {
    this._item = null, this._map = /* @__PURE__ */ new Map(), this._start = null, this.doc = null, this._length = 0, this._eH = To(), this._dEH = To(), this._searchMarker = null;
  }
  /**
   * @return {AbstractType<any>|null}
   */
  get parent() {
    return this._item ? (
      /** @type {AbstractType<any>} */
      this._item.parent
    ) : null;
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item|null} item
   */
  _integrate(e, n) {
    this.doc = e, this._item = n;
  }
  /**
   * @return {AbstractType<EventType>}
   */
  _copy() {
    throw de();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {AbstractType<EventType>}
   */
  clone() {
    throw de();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} _encoder
   */
  _write(e) {
  }
  /**
   * The first non-deleted item
   */
  get _first() {
    let e = this._start;
    for (; e !== null && e.deleted; )
      e = e.right;
    return e;
  }
  /**
   * Creates YEvent and calls all type observers.
   * Must be implemented by each type.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} _parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(e, n) {
    !e.local && this._searchMarker && (this._searchMarker.length = 0);
  }
  /**
   * Observe all events that are created on this type.
   *
   * @param {function(EventType, Transaction):void} f Observer function
   */
  observe(e) {
    Lo(this._eH, e);
  }
  /**
   * Observe all events that are created by this type and its children.
   *
   * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
   */
  observeDeep(e) {
    Lo(this._dEH, e);
  }
  /**
   * Unregister an observer function.
   *
   * @param {function(EventType,Transaction):void} f Observer function
   */
  unobserve(e) {
    Io(this._eH, e);
  }
  /**
   * Unregister an observer function.
   *
   * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
   */
  unobserveDeep(e) {
    Io(this._dEH, e);
  }
  /**
   * @abstract
   * @return {any}
   */
  toJSON() {
  }
}
const Ya = (t, e, n) => {
  e < 0 && (e = t._length + e), n < 0 && (n = t._length + n);
  let s = n - e;
  const r = [];
  let i = t._start;
  for (; i !== null && s > 0; ) {
    if (i.countable && !i.deleted) {
      const o = i.content.getContent();
      if (o.length <= e)
        e -= o.length;
      else {
        for (let c = e; c < o.length && s > 0; c++)
          r.push(o[c]), s--;
        e = 0;
      }
    }
    i = i.right;
  }
  return r;
}, Ga = (t) => {
  const e = [];
  let n = t._start;
  for (; n !== null; ) {
    if (n.countable && !n.deleted) {
      const s = n.content.getContent();
      for (let r = 0; r < s.length; r++)
        e.push(s[r]);
    }
    n = n.right;
  }
  return e;
}, mn = (t, e) => {
  let n = 0, s = t._start;
  for (; s !== null; ) {
    if (s.countable && !s.deleted) {
      const r = s.content.getContent();
      for (let i = 0; i < r.length; i++)
        e(r[i], n++, t);
    }
    s = s.right;
  }
}, qa = (t, e) => {
  const n = [];
  return mn(t, (s, r) => {
    n.push(e(s, r, t));
  }), n;
}, Lf = (t) => {
  let e = t._start, n = null, s = 0;
  return {
    [Symbol.iterator]() {
      return this;
    },
    next: () => {
      if (n === null) {
        for (; e !== null && e.deleted; )
          e = e.right;
        if (e === null)
          return {
            done: !0,
            value: void 0
          };
        n = e.content.getContent(), s = 0, e = e.right;
      }
      const r = n[s++];
      return n.length <= s && (n = null), {
        done: !1,
        value: r
      };
    }
  };
}, Ja = (t, e) => {
  const n = Vs(t, e);
  let s = t._start;
  for (n !== null && (s = n.p, e -= n.index); s !== null; s = s.right)
    if (!s.deleted && s.countable) {
      if (e < s.length)
        return s.content.getContent()[e];
      e -= s.length;
    }
}, vs = (t, e, n, s) => {
  let r = n;
  const i = t.doc, o = i.clientID, c = i.store, a = n === null ? e._start : n.right;
  let l = [];
  const u = () => {
    l.length > 0 && (r = new P(A(o, j(c, o)), r, r && r.lastId, a, a && a.id, e, null, new ft(l)), r.integrate(t, 0), l = []);
  };
  s.forEach((h) => {
    if (h === null)
      l.push(h);
    else
      switch (h.constructor) {
        case Number:
        case Object:
        case Boolean:
        case Array:
        case String:
          l.push(h);
          break;
        default:
          switch (u(), h.constructor) {
            case Uint8Array:
            case ArrayBuffer:
              r = new P(A(o, j(c, o)), r, r && r.lastId, a, a && a.id, e, null, new Rn(new Uint8Array(
                /** @type {Uint8Array} */
                h
              ))), r.integrate(t, 0);
              break;
            case me:
              r = new P(A(o, j(c, o)), r, r && r.lastId, a, a && a.id, e, null, new Nn(
                /** @type {Doc} */
                h
              )), r.integrate(t, 0);
              break;
            default:
              if (h instanceof L)
                r = new P(A(o, j(c, o)), r, r && r.lastId, a, a && a.id, e, null, new Oe(h)), r.integrate(t, 0);
              else
                throw new Error("Unexpected content type in insert operation");
          }
      }
  }), u();
}, Xa = () => Ce("Length exceeded!"), Za = (t, e, n, s) => {
  if (n > e._length)
    throw Xa();
  if (n === 0)
    return e._searchMarker && yn(e._searchMarker, n, s.length), vs(t, e, null, s);
  const r = n, i = Vs(e, n);
  let o = e._start;
  for (i !== null && (o = i.p, n -= i.index, n === 0 && (o = o.prev, n += o && o.countable && !o.deleted ? o.length : 0)); o !== null; o = o.right)
    if (!o.deleted && o.countable) {
      if (n <= o.length) {
        n < o.length && Ke(t, A(o.id.client, o.id.clock + n));
        break;
      }
      n -= o.length;
    }
  return e._searchMarker && yn(e._searchMarker, r, s.length), vs(t, e, o, s);
}, If = (t, e, n) => {
  let r = (e._searchMarker || []).reduce((i, o) => o.index > i.index ? o : i, { index: 0, p: e._start }).p;
  if (r)
    for (; r.right; )
      r = r.right;
  return vs(t, e, r, n);
}, Qa = (t, e, n, s) => {
  if (s === 0)
    return;
  const r = n, i = s, o = Vs(e, n);
  let c = e._start;
  for (o !== null && (c = o.p, n -= o.index); c !== null && n > 0; c = c.right)
    !c.deleted && c.countable && (n < c.length && Ke(t, A(c.id.client, c.id.clock + n)), n -= c.length);
  for (; s > 0 && c !== null; )
    c.deleted || (s < c.length && Ke(t, A(c.id.client, c.id.clock + s)), c.delete(t), s -= c.length), c = c.right;
  if (s > 0)
    throw Xa();
  e._searchMarker && yn(
    e._searchMarker,
    r,
    -i + s
    /* in case we remove the above exception */
  );
}, Cs = (t, e, n) => {
  const s = e._map.get(n);
  s !== void 0 && s.delete(t);
}, xi = (t, e, n, s) => {
  const r = e._map.get(n) || null, i = t.doc, o = i.clientID;
  let c;
  if (s == null)
    c = new ft([s]);
  else
    switch (s.constructor) {
      case Number:
      case Object:
      case Boolean:
      case Array:
      case String:
        c = new ft([s]);
        break;
      case Uint8Array:
        c = new Rn(
          /** @type {Uint8Array} */
          s
        );
        break;
      case me:
        c = new Nn(
          /** @type {Doc} */
          s
        );
        break;
      default:
        if (s instanceof L)
          c = new Oe(s);
        else
          throw new Error("Unexpected content type");
    }
  new P(A(o, j(i.store, o)), r, r && r.lastId, null, null, e, n, c).integrate(t, 0);
}, Di = (t, e) => {
  const n = t._map.get(e);
  return n !== void 0 && !n.deleted ? n.content.getContent()[n.length - 1] : void 0;
}, el = (t) => {
  const e = {};
  return t._map.forEach((n, s) => {
    n.deleted || (e[s] = n.content.getContent()[n.length - 1]);
  }), e;
}, tl = (t, e) => {
  const n = t._map.get(e);
  return n !== void 0 && !n.deleted;
}, Mf = (t, e) => {
  const n = {};
  return t._map.forEach((s, r) => {
    let i = s;
    for (; i !== null && (!e.sv.has(i.id.client) || i.id.clock >= (e.sv.get(i.id.client) || 0)); )
      i = i.left;
    i !== null && _t(i, e) && (n[r] = i.content.getContent()[i.length - 1]);
  }), n;
}, Yn = (t) => Yd(
  t.entries(),
  /** @param {any} entry */
  (e) => !e[1].deleted
);
class $f extends Bs {
}
class be extends L {
  constructor() {
    super(), this._prelimContent = [], this._searchMarker = [];
  }
  /**
   * Construct a new YArray containing the specified items.
   * @template {Object<string,any>|Array<any>|number|null|string|Uint8Array} T
   * @param {Array<T>} items
   * @return {YArray<T>}
   */
  static from(e) {
    const n = new be();
    return n.push(e), n;
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate(e, n) {
    super._integrate(e, n), this.insert(
      0,
      /** @type {Array<any>} */
      this._prelimContent
    ), this._prelimContent = null;
  }
  /**
   * @return {YArray<T>}
   */
  _copy() {
    return new be();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YArray<T>}
   */
  clone() {
    const e = new be();
    return e.insert(0, this.toArray().map(
      (n) => n instanceof L ? (
        /** @type {typeof el} */
        n.clone()
      ) : n
    )), e;
  }
  get length() {
    return this._prelimContent === null ? this._length : this._prelimContent.length;
  }
  /**
   * Creates YArrayEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(e, n) {
    super._callObserver(e, n), Ks(this, e, new $f(this, e));
  }
  /**
   * Inserts new content at an index.
   *
   * Important: This function expects an array of content. Not just a content
   * object. The reason for this "weirdness" is that inserting several elements
   * is very efficient when it is done as a single operation.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  yarray.insert(0, ['a'])
   *  // Insert numbers 1, 2 at position 1
   *  yarray.insert(1, [1, 2])
   *
   * @param {number} index The index to insert content at.
   * @param {Array<T>} content The array of content
   */
  insert(e, n) {
    this.doc !== null ? k(this.doc, (s) => {
      Za(
        s,
        this,
        e,
        /** @type {any} */
        n
      );
    }) : this._prelimContent.splice(e, 0, ...n);
  }
  /**
   * Appends content to this YArray.
   *
   * @param {Array<T>} content Array of content to append.
   *
   * @todo Use the following implementation in all types.
   */
  push(e) {
    this.doc !== null ? k(this.doc, (n) => {
      If(
        n,
        this,
        /** @type {any} */
        e
      );
    }) : this._prelimContent.push(...e);
  }
  /**
   * Prepends content to this YArray.
   *
   * @param {Array<T>} content Array of content to prepend.
   */
  unshift(e) {
    this.insert(0, e);
  }
  /**
   * Deletes elements starting from an index.
   *
   * @param {number} index Index at which to start deleting elements
   * @param {number} length The number of elements to remove. Defaults to 1.
   */
  delete(e, n = 1) {
    this.doc !== null ? k(this.doc, (s) => {
      Qa(s, this, e, n);
    }) : this._prelimContent.splice(e, n);
  }
  /**
   * Returns the i-th element from a YArray.
   *
   * @param {number} index The index of the element to return from the YArray
   * @return {T}
   */
  get(e) {
    return Ja(this, e);
  }
  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @return {Array<T>}
   */
  toArray() {
    return Ga(this);
  }
  /**
   * Returns a portion of this YArray into a JavaScript Array selected
   * from start to end (end not included).
   *
   * @param {number} [start]
   * @param {number} [end]
   * @return {Array<T>}
   */
  slice(e = 0, n = this.length) {
    return Ya(this, e, n);
  }
  /**
   * Transforms this Shared Type to a JSON object.
   *
   * @return {Array<any>}
   */
  toJSON() {
    return this.map((e) => e instanceof L ? e.toJSON() : e);
  }
  /**
   * Returns an Array with the result of calling a provided function on every
   * element of this YArray.
   *
   * @template M
   * @param {function(T,number,YArray<T>):M} f Function that produces an element of the new Array
   * @return {Array<M>} A new array with each element being the result of the
   *                 callback function
   */
  map(e) {
    return qa(
      this,
      /** @type {any} */
      e
    );
  }
  /**
   * Executes a provided function once on every element of this YArray.
   *
   * @param {function(T,number,YArray<T>):void} f A function to execute on every element of this YArray.
   */
  forEach(e) {
    mn(this, e);
  }
  /**
   * @return {IterableIterator<T>}
   */
  [Symbol.iterator]() {
    return Lf(this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(e) {
    e.writeTypeRef(sp);
  }
}
const Of = (t) => new be();
class Pf extends Bs {
  /**
   * @param {YMap<T>} ymap The YArray that changed.
   * @param {Transaction} transaction
   * @param {Set<any>} subs The keys that changed.
   */
  constructor(e, n, s) {
    super(e, n), this.keysChanged = s;
  }
}
class Se extends L {
  /**
   *
   * @param {Iterable<readonly [string, any]>=} entries - an optional iterable to initialize the YMap
   */
  constructor(e) {
    super(), this._prelimContent = null, e === void 0 ? this._prelimContent = /* @__PURE__ */ new Map() : this._prelimContent = new Map(e);
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate(e, n) {
    super._integrate(e, n), this._prelimContent.forEach((s, r) => {
      this.set(r, s);
    }), this._prelimContent = null;
  }
  /**
   * @return {YMap<MapType>}
   */
  _copy() {
    return new Se();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YMap<MapType>}
   */
  clone() {
    const e = new Se();
    return this.forEach((n, s) => {
      e.set(s, n instanceof L ? (
        /** @type {typeof value} */
        n.clone()
      ) : n);
    }), e;
  }
  /**
   * Creates YMapEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(e, n) {
    Ks(this, e, new Pf(this, e, n));
  }
  /**
   * Transforms this Shared Type to a JSON object.
   *
   * @return {Object<string,any>}
   */
  toJSON() {
    const e = {};
    return this._map.forEach((n, s) => {
      if (!n.deleted) {
        const r = n.content.getContent()[n.length - 1];
        e[s] = r instanceof L ? r.toJSON() : r;
      }
    }), e;
  }
  /**
   * Returns the size of the YMap (count of key/value pairs)
   *
   * @return {number}
   */
  get size() {
    return [...Yn(this._map)].length;
  }
  /**
   * Returns the keys for each element in the YMap Type.
   *
   * @return {IterableIterator<string>}
   */
  keys() {
    return lr(
      Yn(this._map),
      /** @param {any} v */
      (e) => e[0]
    );
  }
  /**
   * Returns the values for each element in the YMap Type.
   *
   * @return {IterableIterator<MapType>}
   */
  values() {
    return lr(
      Yn(this._map),
      /** @param {any} v */
      (e) => e[1].content.getContent()[e[1].length - 1]
    );
  }
  /**
   * Returns an Iterator of [key, value] pairs
   *
   * @return {IterableIterator<[string, MapType]>}
   */
  entries() {
    return lr(
      Yn(this._map),
      /** @param {any} v */
      (e) => (
        /** @type {any} */
        [e[0], e[1].content.getContent()[e[1].length - 1]]
      )
    );
  }
  /**
   * Executes a provided function on once on every key-value pair.
   *
   * @param {function(MapType,string,YMap<MapType>):void} f A function to execute on every element of this YArray.
   */
  forEach(e) {
    this._map.forEach((n, s) => {
      n.deleted || e(n.content.getContent()[n.length - 1], s, this);
    });
  }
  /**
   * Returns an Iterator of [key, value] pairs
   *
   * @return {IterableIterator<[string, MapType]>}
   */
  [Symbol.iterator]() {
    return this.entries();
  }
  /**
   * Remove a specified element from this YMap.
   *
   * @param {string} key The key of the element to remove.
   */
  delete(e) {
    this.doc !== null ? k(this.doc, (n) => {
      Cs(n, this, e);
    }) : this._prelimContent.delete(e);
  }
  /**
   * Adds or updates an element with a specified key and value.
   * @template {MapType} VAL
   *
   * @param {string} key The key of the element to add to this YMap
   * @param {VAL} value The value of the element to add
   * @return {VAL}
   */
  set(e, n) {
    return this.doc !== null ? k(this.doc, (s) => {
      xi(
        s,
        this,
        e,
        /** @type {any} */
        n
      );
    }) : this._prelimContent.set(e, n), n;
  }
  /**
   * Returns a specified element from this YMap.
   *
   * @param {string} key
   * @return {MapType|undefined}
   */
  get(e) {
    return (
      /** @type {any} */
      Di(this, e)
    );
  }
  /**
   * Returns a boolean indicating whether the specified key exists or not.
   *
   * @param {string} key The key to test.
   * @return {boolean}
   */
  has(e) {
    return tl(this, e);
  }
  /**
   * Removes all elements from this YMap.
   */
  clear() {
    this.doc !== null ? k(this.doc, (e) => {
      this.forEach(function(n, s, r) {
        Cs(e, r, s);
      });
    }) : this._prelimContent.clear();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(e) {
    e.writeTypeRef(rp);
  }
}
const Rf = (t) => new Se(), Fe = (t, e) => t === e || typeof t == "object" && typeof e == "object" && t && e && $h(t, e);
class Ur {
  /**
   * @param {Item|null} left
   * @param {Item|null} right
   * @param {number} index
   * @param {Map<string,any>} currentAttributes
   */
  constructor(e, n, s, r) {
    this.left = e, this.right = n, this.index = s, this.currentAttributes = r;
  }
  /**
   * Only call this if you know that this.right is defined
   */
  forward() {
    this.right === null && ce(), this.right.content.constructor === N ? this.right.deleted || Bt(
      this.currentAttributes,
      /** @type {ContentFormat} */
      this.right.content
    ) : this.right.deleted || (this.index += this.right.length), this.left = this.right, this.right = this.right.right;
  }
}
const Ro = (t, e, n) => {
  for (; e.right !== null && n > 0; )
    e.right.content.constructor === N ? e.right.deleted || Bt(
      e.currentAttributes,
      /** @type {ContentFormat} */
      e.right.content
    ) : e.right.deleted || (n < e.right.length && Ke(t, A(e.right.id.client, e.right.id.clock + n)), e.index += e.right.length, n -= e.right.length), e.left = e.right, e.right = e.right.right;
  return e;
}, Gn = (t, e, n, s) => {
  const r = /* @__PURE__ */ new Map(), i = s ? Vs(e, n) : null;
  if (i) {
    const o = new Ur(i.p.left, i.p, i.index, r);
    return Ro(t, o, n - i.index);
  } else {
    const o = new Ur(null, e._start, 0, r);
    return Ro(t, o, n);
  }
}, nl = (t, e, n, s) => {
  for (; n.right !== null && (n.right.deleted === !0 || n.right.content.constructor === N && Fe(
    s.get(
      /** @type {ContentFormat} */
      n.right.content.key
    ),
    /** @type {ContentFormat} */
    n.right.content.value
  )); )
    n.right.deleted || s.delete(
      /** @type {ContentFormat} */
      n.right.content.key
    ), n.forward();
  const r = t.doc, i = r.clientID;
  s.forEach((o, c) => {
    const a = n.left, l = n.right, u = new P(A(i, j(r.store, i)), a, a && a.lastId, l, l && l.id, e, null, new N(c, o));
    u.integrate(t, 0), n.right = u, n.forward();
  });
}, Bt = (t, e) => {
  const { key: n, value: s } = e;
  s === null ? t.delete(n) : t.set(n, s);
}, sl = (t, e) => {
  for (; t.right !== null; ) {
    if (!(t.right.deleted || t.right.content.constructor === N && Fe(
      e[
        /** @type {ContentFormat} */
        t.right.content.key
      ] ?? null,
      /** @type {ContentFormat} */
      t.right.content.value
    ))) break;
    t.forward();
  }
}, rl = (t, e, n, s) => {
  const r = t.doc, i = r.clientID, o = /* @__PURE__ */ new Map();
  for (const c in s) {
    const a = s[c], l = n.currentAttributes.get(c) ?? null;
    if (!Fe(l, a)) {
      o.set(c, l);
      const { left: u, right: h } = n;
      n.right = new P(A(i, j(r.store, i)), u, u && u.lastId, h, h && h.id, e, null, new N(c, a)), n.right.integrate(t, 0), n.forward();
    }
  }
  return o;
}, hr = (t, e, n, s, r) => {
  n.currentAttributes.forEach((d, f) => {
    r[f] === void 0 && (r[f] = null);
  });
  const i = t.doc, o = i.clientID;
  sl(n, r);
  const c = rl(t, e, n, r), a = s.constructor === String ? new _e(
    /** @type {string} */
    s
  ) : s instanceof L ? new Oe(s) : new Ct(s);
  let { left: l, right: u, index: h } = n;
  e._searchMarker && yn(e._searchMarker, n.index, a.getLength()), u = new P(A(o, j(i.store, o)), l, l && l.lastId, u, u && u.id, e, null, a), u.integrate(t, 0), n.right = u, n.index = h, n.forward(), nl(t, e, n, c);
}, No = (t, e, n, s, r) => {
  const i = t.doc, o = i.clientID;
  sl(n, r);
  const c = rl(t, e, n, r);
  e: for (; n.right !== null && (s > 0 || c.size > 0 && (n.right.deleted || n.right.content.constructor === N)); ) {
    if (!n.right.deleted)
      switch (n.right.content.constructor) {
        case N: {
          const { key: a, value: l } = (
            /** @type {ContentFormat} */
            n.right.content
          ), u = r[a];
          if (u !== void 0) {
            if (Fe(u, l))
              c.delete(a);
            else {
              if (s === 0)
                break e;
              c.set(a, l);
            }
            n.right.delete(t);
          } else
            n.currentAttributes.set(a, l);
          break;
        }
        default:
          s < n.right.length && Ke(t, A(n.right.id.client, n.right.id.clock + s)), s -= n.right.length;
          break;
      }
    n.forward();
  }
  if (s > 0) {
    let a = "";
    for (; s > 0; s--)
      a += `
`;
    n.right = new P(A(o, j(i.store, o)), n.left, n.left && n.left.lastId, n.right, n.right && n.right.id, e, null, new _e(a)), n.right.integrate(t, 0), n.forward();
  }
  nl(t, e, n, c);
}, il = (t, e, n, s, r) => {
  let i = e;
  const o = te();
  for (; i && (!i.countable || i.deleted); ) {
    if (!i.deleted && i.content.constructor === N) {
      const l = (
        /** @type {ContentFormat} */
        i.content
      );
      o.set(l.key, l);
    }
    i = i.right;
  }
  let c = 0, a = !1;
  for (; e !== i; ) {
    if (n === e && (a = !0), !e.deleted) {
      const l = e.content;
      if (l.constructor === N) {
        const { key: u, value: h } = (
          /** @type {ContentFormat} */
          l
        ), d = s.get(u) ?? null;
        (o.get(u) !== l || d === h) && (e.delete(t), c++, !a && (r.get(u) ?? null) === h && d !== h && (d === null ? r.delete(u) : r.set(u, d))), !a && !e.deleted && Bt(
          r,
          /** @type {ContentFormat} */
          l
        );
      }
    }
    e = /** @type {Item} */
    e.right;
  }
  return c;
}, Nf = (t, e) => {
  for (; e && e.right && (e.right.deleted || !e.right.countable); )
    e = e.right;
  const n = /* @__PURE__ */ new Set();
  for (; e && (e.deleted || !e.countable); ) {
    if (!e.deleted && e.content.constructor === N) {
      const s = (
        /** @type {ContentFormat} */
        e.content.key
      );
      n.has(s) ? e.delete(t) : n.add(s);
    }
    e = e.left;
  }
}, Uf = (t) => {
  let e = 0;
  return k(
    /** @type {Doc} */
    t.doc,
    (n) => {
      let s = (
        /** @type {Item} */
        t._start
      ), r = t._start, i = te();
      const o = Mr(i);
      for (; r; )
        r.deleted === !1 && (r.content.constructor === N ? Bt(
          o,
          /** @type {ContentFormat} */
          r.content
        ) : (e += il(n, s, r, i, o), i = Mr(o), s = r)), r = r.right;
    }
  ), e;
}, Ff = (t) => {
  const e = /* @__PURE__ */ new Set(), n = t.doc;
  for (const [s, r] of t.afterState.entries()) {
    const i = t.beforeState.get(s) || 0;
    r !== i && za(
      t,
      /** @type {Array<Item|GC>} */
      n.store.clients.get(s),
      i,
      r,
      (o) => {
        !o.deleted && /** @type {Item} */
        o.content.constructor === N && o.constructor !== re && e.add(
          /** @type {any} */
          o.parent
        );
      }
    );
  }
  k(n, (s) => {
    Ta(t, t.deleteSet, (r) => {
      if (r instanceof re || !/** @type {YText} */
      r.parent._hasFormatting || e.has(
        /** @type {YText} */
        r.parent
      ))
        return;
      const i = (
        /** @type {YText} */
        r.parent
      );
      r.content.constructor === N ? e.add(i) : Nf(s, r);
    });
    for (const r of e)
      Uf(r);
  });
}, Uo = (t, e, n) => {
  const s = n, r = Mr(e.currentAttributes), i = e.right;
  for (; n > 0 && e.right !== null; ) {
    if (e.right.deleted === !1)
      switch (e.right.content.constructor) {
        case Oe:
        case Ct:
        case _e:
          n < e.right.length && Ke(t, A(e.right.id.client, e.right.id.clock + n)), n -= e.right.length, e.right.delete(t);
          break;
      }
    e.forward();
  }
  i && il(t, i, e.right, r, e.currentAttributes);
  const o = (
    /** @type {AbstractType<any>} */
    /** @type {Item} */
    (e.left || e.right).parent
  );
  return o._searchMarker && yn(o._searchMarker, e.index, -s + n), e;
};
class jf extends Bs {
  /**
   * @param {YText} ytext
   * @param {Transaction} transaction
   * @param {Set<any>} subs The keys that changed
   */
  constructor(e, n, s) {
    super(e, n), this.childListChanged = !1, this.keysChanged = /* @__PURE__ */ new Set(), s.forEach((r) => {
      r === null ? this.childListChanged = !0 : this.keysChanged.add(r);
    });
  }
  /**
   * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string, delete?:number, retain?:number}>}}
   */
  get changes() {
    if (this._changes === null) {
      const e = {
        keys: this.keys,
        delta: this.delta,
        added: /* @__PURE__ */ new Set(),
        deleted: /* @__PURE__ */ new Set()
      };
      this._changes = e;
    }
    return (
      /** @type {any} */
      this._changes
    );
  }
  /**
   * Compute the changes in the delta format.
   * A {@link https://quilljs.com/docs/delta/|Quill Delta}) that represents the changes on the document.
   *
   * @type {Array<{insert?:string|object|AbstractType<any>, delete?:number, retain?:number, attributes?: Object<string,any>}>}
   *
   * @public
   */
  get delta() {
    if (this._delta === null) {
      const e = (
        /** @type {Doc} */
        this.target.doc
      ), n = [];
      k(e, (s) => {
        const r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
        let o = this.target._start, c = null;
        const a = {};
        let l = "", u = 0, h = 0;
        const d = () => {
          if (c !== null) {
            let f = null;
            switch (c) {
              case "delete":
                h > 0 && (f = { delete: h }), h = 0;
                break;
              case "insert":
                (typeof l == "object" || l.length > 0) && (f = { insert: l }, r.size > 0 && (f.attributes = {}, r.forEach((p, g) => {
                  p !== null && (f.attributes[g] = p);
                }))), l = "";
                break;
              case "retain":
                u > 0 && (f = { retain: u }, Mh(a) || (f.attributes = Dh({}, a))), u = 0;
                break;
            }
            f && n.push(f), c = null;
          }
        };
        for (; o !== null; ) {
          switch (o.content.constructor) {
            case Oe:
            case Ct:
              this.adds(o) ? this.deletes(o) || (d(), c = "insert", l = o.content.getContent()[0], d()) : this.deletes(o) ? (c !== "delete" && (d(), c = "delete"), h += 1) : o.deleted || (c !== "retain" && (d(), c = "retain"), u += 1);
              break;
            case _e:
              this.adds(o) ? this.deletes(o) || (c !== "insert" && (d(), c = "insert"), l += /** @type {ContentString} */
              o.content.str) : this.deletes(o) ? (c !== "delete" && (d(), c = "delete"), h += o.length) : o.deleted || (c !== "retain" && (d(), c = "retain"), u += o.length);
              break;
            case N: {
              const { key: f, value: p } = (
                /** @type {ContentFormat} */
                o.content
              );
              if (this.adds(o)) {
                if (!this.deletes(o)) {
                  const g = r.get(f) ?? null;
                  Fe(g, p) ? p !== null && o.delete(s) : (c === "retain" && d(), Fe(p, i.get(f) ?? null) ? delete a[f] : a[f] = p);
                }
              } else if (this.deletes(o)) {
                i.set(f, p);
                const g = r.get(f) ?? null;
                Fe(g, p) || (c === "retain" && d(), a[f] = g);
              } else if (!o.deleted) {
                i.set(f, p);
                const g = a[f];
                g !== void 0 && (Fe(g, p) ? g !== null && o.delete(s) : (c === "retain" && d(), p === null ? delete a[f] : a[f] = p));
              }
              o.deleted || (c === "insert" && d(), Bt(
                r,
                /** @type {ContentFormat} */
                o.content
              ));
              break;
            }
          }
          o = o.right;
        }
        for (d(); n.length > 0; ) {
          const f = n[n.length - 1];
          if (f.retain !== void 0 && f.attributes === void 0)
            n.pop();
          else
            break;
        }
      }), this._delta = n;
    }
    return (
      /** @type {any} */
      this._delta
    );
  }
}
class Ie extends L {
  /**
   * @param {String} [string] The initial value of the YText.
   */
  constructor(e) {
    super(), this._pending = e !== void 0 ? [() => this.insert(0, e)] : [], this._searchMarker = [], this._hasFormatting = !1;
  }
  /**
   * Number of characters of this text type.
   *
   * @type {number}
   */
  get length() {
    return this._length;
  }
  /**
   * @param {Doc} y
   * @param {Item} item
   */
  _integrate(e, n) {
    super._integrate(e, n);
    try {
      this._pending.forEach((s) => s());
    } catch (s) {
      console.error(s);
    }
    this._pending = null;
  }
  _copy() {
    return new Ie();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YText}
   */
  clone() {
    const e = new Ie();
    return e.applyDelta(this.toDelta()), e;
  }
  /**
   * Creates YTextEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(e, n) {
    super._callObserver(e, n);
    const s = new jf(this, e, n);
    Ks(this, e, s), !e.local && this._hasFormatting && (e._needFormattingCleanup = !0);
  }
  /**
   * Returns the unformatted string representation of this YText type.
   *
   * @public
   */
  toString() {
    let e = "", n = this._start;
    for (; n !== null; )
      !n.deleted && n.countable && n.content.constructor === _e && (e += /** @type {ContentString} */
      n.content.str), n = n.right;
    return e;
  }
  /**
   * Returns the unformatted string representation of this YText type.
   *
   * @return {string}
   * @public
   */
  toJSON() {
    return this.toString();
  }
  /**
   * Apply a {@link Delta} on this shared YText type.
   *
   * @param {any} delta The changes to apply on this element.
   * @param {object}  opts
   * @param {boolean} [opts.sanitize] Sanitize input delta. Removes ending newlines if set to true.
   *
   *
   * @public
   */
  applyDelta(e, { sanitize: n = !0 } = {}) {
    this.doc !== null ? k(this.doc, (s) => {
      const r = new Ur(null, this._start, 0, /* @__PURE__ */ new Map());
      for (let i = 0; i < e.length; i++) {
        const o = e[i];
        if (o.insert !== void 0) {
          const c = !n && typeof o.insert == "string" && i === e.length - 1 && r.right === null && o.insert.slice(-1) === `
` ? o.insert.slice(0, -1) : o.insert;
          (typeof c != "string" || c.length > 0) && hr(s, this, r, c, o.attributes || {});
        } else o.retain !== void 0 ? No(s, this, r, o.retain, o.attributes || {}) : o.delete !== void 0 && Uo(s, r, o.delete);
      }
    }) : this._pending.push(() => this.applyDelta(e));
  }
  /**
   * Returns the Delta representation of this YText type.
   *
   * @param {Snapshot} [snapshot]
   * @param {Snapshot} [prevSnapshot]
   * @param {function('removed' | 'added', ID):any} [computeYChange]
   * @return {any} The Delta representation of this type.
   *
   * @public
   */
  toDelta(e, n, s) {
    const r = [], i = /* @__PURE__ */ new Map(), o = (
      /** @type {Doc} */
      this.doc
    );
    let c = "", a = this._start;
    function l() {
      if (c.length > 0) {
        const h = {};
        let d = !1;
        i.forEach((p, g) => {
          d = !0, h[g] = p;
        });
        const f = { insert: c };
        d && (f.attributes = h), r.push(f), c = "";
      }
    }
    const u = () => {
      for (; a !== null; ) {
        if (_t(a, e) || n !== void 0 && _t(a, n))
          switch (a.content.constructor) {
            case _e: {
              const h = i.get("ychange");
              e !== void 0 && !_t(a, e) ? (h === void 0 || h.user !== a.id.client || h.type !== "removed") && (l(), i.set("ychange", s ? s("removed", a.id) : { type: "removed" })) : n !== void 0 && !_t(a, n) ? (h === void 0 || h.user !== a.id.client || h.type !== "added") && (l(), i.set("ychange", s ? s("added", a.id) : { type: "added" })) : h !== void 0 && (l(), i.delete("ychange")), c += /** @type {ContentString} */
              a.content.str;
              break;
            }
            case Oe:
            case Ct: {
              l();
              const h = {
                insert: a.content.getContent()[0]
              };
              if (i.size > 0) {
                const d = (
                  /** @type {Object<string,any>} */
                  {}
                );
                h.attributes = d, i.forEach((f, p) => {
                  d[p] = f;
                });
              }
              r.push(h);
              break;
            }
            case N:
              _t(a, e) && (l(), Bt(
                i,
                /** @type {ContentFormat} */
                a.content
              ));
              break;
          }
        a = a.right;
      }
      l();
    };
    return e || n ? k(o, (h) => {
      e && Rr(h, e), n && Rr(h, n), u();
    }, "cleanup") : u(), r;
  }
  /**
   * Insert text at a given index.
   *
   * @param {number} index The index at which to start inserting.
   * @param {String} text The text to insert at the specified position.
   * @param {TextAttributes} [attributes] Optionally define some formatting
   *                                    information to apply on the inserted
   *                                    Text.
   * @public
   */
  insert(e, n, s) {
    if (n.length <= 0)
      return;
    const r = this.doc;
    r !== null ? k(r, (i) => {
      const o = Gn(i, this, e, !s);
      s || (s = {}, o.currentAttributes.forEach((c, a) => {
        s[a] = c;
      })), hr(i, this, o, n, s);
    }) : this._pending.push(() => this.insert(e, n, s));
  }
  /**
   * Inserts an embed at a index.
   *
   * @param {number} index The index to insert the embed at.
   * @param {Object | AbstractType<any>} embed The Object that represents the embed.
   * @param {TextAttributes} [attributes] Attribute information to apply on the
   *                                    embed
   *
   * @public
   */
  insertEmbed(e, n, s) {
    const r = this.doc;
    r !== null ? k(r, (i) => {
      const o = Gn(i, this, e, !s);
      hr(i, this, o, n, s || {});
    }) : this._pending.push(() => this.insertEmbed(e, n, s || {}));
  }
  /**
   * Deletes text starting from an index.
   *
   * @param {number} index Index at which to start deleting.
   * @param {number} length The number of characters to remove. Defaults to 1.
   *
   * @public
   */
  delete(e, n) {
    if (n === 0)
      return;
    const s = this.doc;
    s !== null ? k(s, (r) => {
      Uo(r, Gn(r, this, e, !0), n);
    }) : this._pending.push(() => this.delete(e, n));
  }
  /**
   * Assigns properties to a range of text.
   *
   * @param {number} index The position where to start formatting.
   * @param {number} length The amount of characters to assign properties to.
   * @param {TextAttributes} attributes Attribute information to apply on the
   *                                    text.
   *
   * @public
   */
  format(e, n, s) {
    if (n === 0)
      return;
    const r = this.doc;
    r !== null ? k(r, (i) => {
      const o = Gn(i, this, e, !1);
      o.right !== null && No(i, this, o, n, s);
    }) : this._pending.push(() => this.format(e, n, s));
  }
  /**
   * Removes an attribute.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that is to be removed.
   *
   * @public
   */
  removeAttribute(e) {
    this.doc !== null ? k(this.doc, (n) => {
      Cs(n, this, e);
    }) : this._pending.push(() => this.removeAttribute(e));
  }
  /**
   * Sets or updates an attribute.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that is to be set.
   * @param {any} attributeValue The attribute value that is to be set.
   *
   * @public
   */
  setAttribute(e, n) {
    this.doc !== null ? k(this.doc, (s) => {
      xi(s, this, e, n);
    }) : this._pending.push(() => this.setAttribute(e, n));
  }
  /**
   * Returns an attribute value that belongs to the attribute name.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that identifies the
   *                               queried value.
   * @return {any} The queried attribute value.
   *
   * @public
   */
  getAttribute(e) {
    return (
      /** @type {any} */
      Di(this, e)
    );
  }
  /**
   * Returns all attribute name/value pairs in a JSON Object.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @return {Object<string, any>} A JSON Object that describes the attributes.
   *
   * @public
   */
  getAttributes() {
    return el(this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(e) {
    e.writeTypeRef(ip);
  }
}
const Hf = (t) => new Ie();
class dr {
  /**
   * @param {YXmlFragment | YXmlElement} root
   * @param {function(AbstractType<any>):boolean} [f]
   */
  constructor(e, n = () => !0) {
    this._filter = n, this._root = e, this._currentNode = /** @type {Item} */
    e._start, this._firstCall = !0;
  }
  [Symbol.iterator]() {
    return this;
  }
  /**
   * Get the next node.
   *
   * @return {IteratorResult<YXmlElement|YXmlText|YXmlHook>} The next node.
   *
   * @public
   */
  next() {
    let e = this._currentNode, n = e && e.content && /** @type {any} */
    e.content.type;
    if (e !== null && (!this._firstCall || e.deleted || !this._filter(n)))
      do
        if (n = /** @type {any} */
        e.content.type, !e.deleted && (n.constructor === Me || n.constructor === Ee) && n._start !== null)
          e = n._start;
        else
          for (; e !== null; )
            if (e.right !== null) {
              e = e.right;
              break;
            } else e.parent === this._root ? e = null : e = /** @type {AbstractType<any>} */
            e.parent._item;
      while (e !== null && (e.deleted || !this._filter(
        /** @type {ContentType} */
        e.content.type
      )));
    return this._firstCall = !1, e === null ? { value: void 0, done: !0 } : (this._currentNode = e, { value: (
      /** @type {any} */
      e.content.type
    ), done: !1 });
  }
}
class Ee extends L {
  constructor() {
    super(), this._prelimContent = [];
  }
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get firstChild() {
    const e = this._first;
    return e ? e.content.getContent()[0] : null;
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate(e, n) {
    super._integrate(e, n), this.insert(
      0,
      /** @type {Array<any>} */
      this._prelimContent
    ), this._prelimContent = null;
  }
  _copy() {
    return new Ee();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlFragment}
   */
  clone() {
    const e = new Ee();
    return e.insert(0, this.toArray().map((n) => n instanceof L ? n.clone() : n)), e;
  }
  get length() {
    return this._prelimContent === null ? this._length : this._prelimContent.length;
  }
  /**
   * Create a subtree of childNodes.
   *
   * @example
   * const walker = elem.createTreeWalker(dom => dom.nodeName === 'div')
   * for (let node in walker) {
   *   // `node` is a div node
   *   nop(node)
   * }
   *
   * @param {function(AbstractType<any>):boolean} filter Function that is called on each child element and
   *                          returns a Boolean indicating whether the child
   *                          is to be included in the subtree.
   * @return {YXmlTreeWalker} A subtree and a position within it.
   *
   * @public
   */
  createTreeWalker(e) {
    return new dr(this, e);
  }
  /**
   * Returns the first YXmlElement that matches the query.
   * Similar to DOM's {@link querySelector}.
   *
   * Query support:
   *   - tagname
   * TODO:
   *   - id
   *   - attribute
   *
   * @param {CSS_Selector} query The query on the children.
   * @return {YXmlElement|YXmlText|YXmlHook|null} The first element that matches the query or null.
   *
   * @public
   */
  querySelector(e) {
    e = e.toUpperCase();
    const s = new dr(this, (r) => r.nodeName && r.nodeName.toUpperCase() === e).next();
    return s.done ? null : s.value;
  }
  /**
   * Returns all YXmlElements that match the query.
   * Similar to Dom's {@link querySelectorAll}.
   *
   * @todo Does not yet support all queries. Currently only query by tagName.
   *
   * @param {CSS_Selector} query The query on the children
   * @return {Array<YXmlElement|YXmlText|YXmlHook|null>} The elements that match this query.
   *
   * @public
   */
  querySelectorAll(e) {
    return e = e.toUpperCase(), Le(new dr(this, (n) => n.nodeName && n.nodeName.toUpperCase() === e));
  }
  /**
   * Creates YXmlEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(e, n) {
    Ks(this, e, new Vf(this, n, e));
  }
  /**
   * Get the string representation of all the children of this YXmlFragment.
   *
   * @return {string} The string representation of all children.
   */
  toString() {
    return qa(this, (e) => e.toString()).join("");
  }
  /**
   * @return {string}
   */
  toJSON() {
    return this.toString();
  }
  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM(e = document, n = {}, s) {
    const r = e.createDocumentFragment();
    return s !== void 0 && s._createAssociation(r, this), mn(this, (i) => {
      r.insertBefore(i.toDOM(e, n, s), null);
    }), r;
  }
  /**
   * Inserts new content at an index.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  xml.insert(0, [new Y.XmlText('text')])
   *
   * @param {number} index The index to insert content at
   * @param {Array<YXmlElement|YXmlText>} content The array of content
   */
  insert(e, n) {
    this.doc !== null ? k(this.doc, (s) => {
      Za(s, this, e, n);
    }) : this._prelimContent.splice(e, 0, ...n);
  }
  /**
   * Inserts new content at an index.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  xml.insert(0, [new Y.XmlText('text')])
   *
   * @param {null|Item|YXmlElement|YXmlText} ref The index to insert content at
   * @param {Array<YXmlElement|YXmlText>} content The array of content
   */
  insertAfter(e, n) {
    if (this.doc !== null)
      k(this.doc, (s) => {
        const r = e && e instanceof L ? e._item : e;
        vs(s, this, r, n);
      });
    else {
      const s = (
        /** @type {Array<any>} */
        this._prelimContent
      ), r = e === null ? 0 : s.findIndex((i) => i === e) + 1;
      if (r === 0 && e !== null)
        throw Ce("Reference item not found");
      s.splice(r, 0, ...n);
    }
  }
  /**
   * Deletes elements starting from an index.
   *
   * @param {number} index Index at which to start deleting elements
   * @param {number} [length=1] The number of elements to remove. Defaults to 1.
   */
  delete(e, n = 1) {
    this.doc !== null ? k(this.doc, (s) => {
      Qa(s, this, e, n);
    }) : this._prelimContent.splice(e, n);
  }
  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @return {Array<YXmlElement|YXmlText|YXmlHook>}
   */
  toArray() {
    return Ga(this);
  }
  /**
   * Appends content to this YArray.
   *
   * @param {Array<YXmlElement|YXmlText>} content Array of content to append.
   */
  push(e) {
    this.insert(this.length, e);
  }
  /**
   * Prepends content to this YArray.
   *
   * @param {Array<YXmlElement|YXmlText>} content Array of content to prepend.
   */
  unshift(e) {
    this.insert(0, e);
  }
  /**
   * Returns the i-th element from a YArray.
   *
   * @param {number} index The index of the element to return from the YArray
   * @return {YXmlElement|YXmlText}
   */
  get(e) {
    return Ja(this, e);
  }
  /**
   * Returns a portion of this YXmlFragment into a JavaScript Array selected
   * from start to end (end not included).
   *
   * @param {number} [start]
   * @param {number} [end]
   * @return {Array<YXmlElement|YXmlText>}
   */
  slice(e = 0, n = this.length) {
    return Ya(this, e, n);
  }
  /**
   * Executes a provided function on once on every child element.
   *
   * @param {function(YXmlElement|YXmlText,number, typeof self):void} f A function to execute on every element of this YArray.
   */
  forEach(e) {
    mn(this, e);
  }
  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   */
  _write(e) {
    e.writeTypeRef(cp);
  }
}
const zf = (t) => new Ee();
class Me extends Ee {
  constructor(e = "UNDEFINED") {
    super(), this.nodeName = e, this._prelimAttrs = /* @__PURE__ */ new Map();
  }
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get nextSibling() {
    const e = this._item ? this._item.next : null;
    return e ? (
      /** @type {YXmlElement|YXmlText} */
      /** @type {ContentType} */
      e.content.type
    ) : null;
  }
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get prevSibling() {
    const e = this._item ? this._item.prev : null;
    return e ? (
      /** @type {YXmlElement|YXmlText} */
      /** @type {ContentType} */
      e.content.type
    ) : null;
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate(e, n) {
    super._integrate(e, n), /** @type {Map<string, any>} */
    this._prelimAttrs.forEach((s, r) => {
      this.setAttribute(r, s);
    }), this._prelimAttrs = null;
  }
  /**
   * Creates an Item with the same effect as this Item (without position effect)
   *
   * @return {YXmlElement}
   */
  _copy() {
    return new Me(this.nodeName);
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlElement<KV>}
   */
  clone() {
    const e = new Me(this.nodeName), n = this.getAttributes();
    return Lh(n, (s, r) => {
      typeof s == "string" && e.setAttribute(r, s);
    }), e.insert(0, this.toArray().map((s) => s instanceof L ? s.clone() : s)), e;
  }
  /**
   * Returns the XML serialization of this YXmlElement.
   * The attributes are ordered by attribute-name, so you can easily use this
   * method to compare YXmlElements
   *
   * @return {string} The string representation of this type.
   *
   * @public
   */
  toString() {
    const e = this.getAttributes(), n = [], s = [];
    for (const c in e)
      s.push(c);
    s.sort();
    const r = s.length;
    for (let c = 0; c < r; c++) {
      const a = s[c];
      n.push(a + '="' + e[a] + '"');
    }
    const i = this.nodeName.toLocaleLowerCase(), o = n.length > 0 ? " " + n.join(" ") : "";
    return `<${i}${o}>${super.toString()}</${i}>`;
  }
  /**
   * Removes an attribute from this YXmlElement.
   *
   * @param {string} attributeName The attribute name that is to be removed.
   *
   * @public
   */
  removeAttribute(e) {
    this.doc !== null ? k(this.doc, (n) => {
      Cs(n, this, e);
    }) : this._prelimAttrs.delete(e);
  }
  /**
   * Sets or updates an attribute.
   *
   * @template {keyof KV & string} KEY
   *
   * @param {KEY} attributeName The attribute name that is to be set.
   * @param {KV[KEY]} attributeValue The attribute value that is to be set.
   *
   * @public
   */
  setAttribute(e, n) {
    this.doc !== null ? k(this.doc, (s) => {
      xi(s, this, e, n);
    }) : this._prelimAttrs.set(e, n);
  }
  /**
   * Returns an attribute value that belongs to the attribute name.
   *
   * @template {keyof KV & string} KEY
   *
   * @param {KEY} attributeName The attribute name that identifies the
   *                               queried value.
   * @return {KV[KEY]|undefined} The queried attribute value.
   *
   * @public
   */
  getAttribute(e) {
    return (
      /** @type {any} */
      Di(this, e)
    );
  }
  /**
   * Returns whether an attribute exists
   *
   * @param {string} attributeName The attribute name to check for existence.
   * @return {boolean} whether the attribute exists.
   *
   * @public
   */
  hasAttribute(e) {
    return (
      /** @type {any} */
      tl(this, e)
    );
  }
  /**
   * Returns all attribute name/value pairs in a JSON Object.
   *
   * @param {Snapshot} [snapshot]
   * @return {{ [Key in Extract<keyof KV,string>]?: KV[Key]}} A JSON Object that describes the attributes.
   *
   * @public
   */
  getAttributes(e) {
    return (
      /** @type {any} */
      e ? Mf(this, e) : el(this)
    );
  }
  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM(e = document, n = {}, s) {
    const r = e.createElement(this.nodeName), i = this.getAttributes();
    for (const o in i) {
      const c = i[o];
      typeof c == "string" && r.setAttribute(o, c);
    }
    return mn(this, (o) => {
      r.appendChild(o.toDOM(e, n, s));
    }), s !== void 0 && s._createAssociation(r, this), r;
  }
  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   */
  _write(e) {
    e.writeTypeRef(op), e.writeKey(this.nodeName);
  }
}
const Bf = (t) => new Me(t.readKey());
class Vf extends Bs {
  /**
   * @param {YXmlElement|YXmlText|YXmlFragment} target The target on which the event is created.
   * @param {Set<string|null>} subs The set of changed attributes. `null` is included if the
   *                   child list changed.
   * @param {Transaction} transaction The transaction instance with wich the
   *                                  change was created.
   */
  constructor(e, n, s) {
    super(e, s), this.childListChanged = !1, this.attributesChanged = /* @__PURE__ */ new Set(), n.forEach((r) => {
      r === null ? this.childListChanged = !0 : this.attributesChanged.add(r);
    });
  }
}
class Nt extends Se {
  /**
   * @param {string} hookName nodeName of the Dom Node.
   */
  constructor(e) {
    super(), this.hookName = e;
  }
  /**
   * Creates an Item with the same effect as this Item (without position effect)
   */
  _copy() {
    return new Nt(this.hookName);
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlHook}
   */
  clone() {
    const e = new Nt(this.hookName);
    return this.forEach((n, s) => {
      e.set(s, n);
    }), e;
  }
  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object.<string, any>} [hooks] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type
   * @return {Element} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM(e = document, n = {}, s) {
    const r = n[this.hookName];
    let i;
    return r !== void 0 ? i = r.createDom(this) : i = document.createElement(this.hookName), i.setAttribute("data-yjs-hook", this.hookName), s !== void 0 && s._createAssociation(i, this), i;
  }
  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   */
  _write(e) {
    e.writeTypeRef(ap), e.writeKey(this.hookName);
  }
}
const Kf = (t) => new Nt(t.readKey());
class dt extends Ie {
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get nextSibling() {
    const e = this._item ? this._item.next : null;
    return e ? (
      /** @type {YXmlElement|YXmlText} */
      /** @type {ContentType} */
      e.content.type
    ) : null;
  }
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get prevSibling() {
    const e = this._item ? this._item.prev : null;
    return e ? (
      /** @type {YXmlElement|YXmlText} */
      /** @type {ContentType} */
      e.content.type
    ) : null;
  }
  _copy() {
    return new dt();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlText}
   */
  clone() {
    const e = new dt();
    return e.applyDelta(this.toDelta()), e;
  }
  /**
   * Creates a Dom Element that mirrors this YXmlText.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Text} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM(e = document, n, s) {
    const r = e.createTextNode(this.toString());
    return s !== void 0 && s._createAssociation(r, this), r;
  }
  toString() {
    return this.toDelta().map((e) => {
      const n = [];
      for (const r in e.attributes) {
        const i = [];
        for (const o in e.attributes[r])
          i.push({ key: o, value: e.attributes[r][o] });
        i.sort((o, c) => o.key < c.key ? -1 : 1), n.push({ nodeName: r, attrs: i });
      }
      n.sort((r, i) => r.nodeName < i.nodeName ? -1 : 1);
      let s = "";
      for (let r = 0; r < n.length; r++) {
        const i = n[r];
        s += `<${i.nodeName}`;
        for (let o = 0; o < i.attrs.length; o++) {
          const c = i.attrs[o];
          s += ` ${c.key}="${c.value}"`;
        }
        s += ">";
      }
      s += e.insert;
      for (let r = n.length - 1; r >= 0; r--)
        s += `</${n[r].nodeName}>`;
      return s;
    }).join("");
  }
  /**
   * @return {string}
   */
  toJSON() {
    return this.toString();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(e) {
    e.writeTypeRef(lp);
  }
}
const Wf = (t) => new dt();
class Ti {
  /**
   * @param {ID} id
   * @param {number} length
   */
  constructor(e, n) {
    this.id = e, this.length = n;
  }
  /**
   * @type {boolean}
   */
  get deleted() {
    throw de();
  }
  /**
   * Merge this struct with the item to the right.
   * This method is already assuming that `this.id.clock + this.length === this.id.clock`.
   * Also this method does *not* remove right from StructStore!
   * @param {AbstractStruct} right
   * @return {boolean} wether this merged with right
   */
  mergeWith(e) {
    return !1;
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   * @param {number} offset
   * @param {number} encodingRef
   */
  write(e, n, s) {
    throw de();
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(e, n) {
    throw de();
  }
}
const Yf = 0;
class re extends Ti {
  get deleted() {
    return !0;
  }
  delete() {
  }
  /**
   * @param {GC} right
   * @return {boolean}
   */
  mergeWith(e) {
    return this.constructor !== e.constructor ? !1 : (this.length += e.length, !0);
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(e, n) {
    n > 0 && (this.id.clock += n, this.length -= n), Ha(e.doc.store, this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    e.writeInfo(Yf), e.writeLen(this.length - n);
  }
  /**
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing(e, n) {
    return null;
  }
}
class Rn {
  /**
   * @param {Uint8Array} content
   */
  constructor(e) {
    this.content = e;
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [this.content];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentBinary}
   */
  copy() {
    return new Rn(this.content);
  }
  /**
   * @param {number} offset
   * @return {ContentBinary}
   */
  splice(e) {
    throw de();
  }
  /**
   * @param {ContentBinary} right
   * @return {boolean}
   */
  mergeWith(e) {
    return !1;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(e, n) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    e.writeBuf(this.content);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 3;
  }
}
const Gf = (t) => new Rn(t.readBuf());
class wn {
  /**
   * @param {number} len
   */
  constructor(e) {
    this.len = e;
  }
  /**
   * @return {number}
   */
  getLength() {
    return this.len;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !1;
  }
  /**
   * @return {ContentDeleted}
   */
  copy() {
    return new wn(this.len);
  }
  /**
   * @param {number} offset
   * @return {ContentDeleted}
   */
  splice(e) {
    const n = new wn(this.len - e);
    return this.len = e, n;
  }
  /**
   * @param {ContentDeleted} right
   * @return {boolean}
   */
  mergeWith(e) {
    return this.len += e.len, !0;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(e, n) {
    ws(e.deleteSet, n.id.client, n.id.clock, this.len), n.markDeleted();
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    e.writeLen(this.len - n);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 1;
  }
}
const qf = (t) => new wn(t.readLen()), ol = (t, e) => new me({ guid: t, ...e, shouldLoad: e.shouldLoad || e.autoLoad || !1 });
class Nn {
  /**
   * @param {Doc} doc
   */
  constructor(e) {
    e._item && console.error("This document was already integrated as a sub-document. You should create a second instance instead with the same guid."), this.doc = e;
    const n = {};
    this.opts = n, e.gc || (n.gc = !1), e.autoLoad && (n.autoLoad = !0), e.meta !== null && (n.meta = e.meta);
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [this.doc];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentDoc}
   */
  copy() {
    return new Nn(ol(this.doc.guid, this.opts));
  }
  /**
   * @param {number} offset
   * @return {ContentDoc}
   */
  splice(e) {
    throw de();
  }
  /**
   * @param {ContentDoc} right
   * @return {boolean}
   */
  mergeWith(e) {
    return !1;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(e, n) {
    this.doc._item = n, e.subdocsAdded.add(this.doc), this.doc.shouldLoad && e.subdocsLoaded.add(this.doc);
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
    e.subdocsAdded.has(this.doc) ? e.subdocsAdded.delete(this.doc) : e.subdocsRemoved.add(this.doc);
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    e.writeString(this.doc.guid), e.writeAny(this.opts);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 9;
  }
}
const Jf = (t) => new Nn(ol(t.readString(), t.readAny()));
class Ct {
  /**
   * @param {Object} embed
   */
  constructor(e) {
    this.embed = e;
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [this.embed];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentEmbed}
   */
  copy() {
    return new Ct(this.embed);
  }
  /**
   * @param {number} offset
   * @return {ContentEmbed}
   */
  splice(e) {
    throw de();
  }
  /**
   * @param {ContentEmbed} right
   * @return {boolean}
   */
  mergeWith(e) {
    return !1;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(e, n) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    e.writeJSON(this.embed);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 5;
  }
}
const Xf = (t) => new Ct(t.readJSON());
class N {
  /**
   * @param {string} key
   * @param {Object} value
   */
  constructor(e, n) {
    this.key = e, this.value = n;
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !1;
  }
  /**
   * @return {ContentFormat}
   */
  copy() {
    return new N(this.key, this.value);
  }
  /**
   * @param {number} _offset
   * @return {ContentFormat}
   */
  splice(e) {
    throw de();
  }
  /**
   * @param {ContentFormat} _right
   * @return {boolean}
   */
  mergeWith(e) {
    return !1;
  }
  /**
   * @param {Transaction} _transaction
   * @param {Item} item
   */
  integrate(e, n) {
    const s = (
      /** @type {YText} */
      n.parent
    );
    s._searchMarker = null, s._hasFormatting = !0;
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    e.writeKey(this.key), e.writeJSON(this.value);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 6;
  }
}
const Zf = (t) => new N(t.readKey(), t.readJSON());
class Ss {
  /**
   * @param {Array<any>} arr
   */
  constructor(e) {
    this.arr = e;
  }
  /**
   * @return {number}
   */
  getLength() {
    return this.arr.length;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return this.arr;
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentJSON}
   */
  copy() {
    return new Ss(this.arr);
  }
  /**
   * @param {number} offset
   * @return {ContentJSON}
   */
  splice(e) {
    const n = new Ss(this.arr.slice(e));
    return this.arr = this.arr.slice(0, e), n;
  }
  /**
   * @param {ContentJSON} right
   * @return {boolean}
   */
  mergeWith(e) {
    return this.arr = this.arr.concat(e.arr), !0;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(e, n) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    const s = this.arr.length;
    e.writeLen(s - n);
    for (let r = n; r < s; r++) {
      const i = this.arr[r];
      e.writeString(i === void 0 ? "undefined" : JSON.stringify(i));
    }
  }
  /**
   * @return {number}
   */
  getRef() {
    return 2;
  }
}
const Qf = (t) => {
  const e = t.readLen(), n = [];
  for (let s = 0; s < e; s++) {
    const r = t.readString();
    r === "undefined" ? n.push(void 0) : n.push(JSON.parse(r));
  }
  return new Ss(n);
};
class ft {
  /**
   * @param {Array<any>} arr
   */
  constructor(e) {
    this.arr = e;
  }
  /**
   * @return {number}
   */
  getLength() {
    return this.arr.length;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return this.arr;
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentAny}
   */
  copy() {
    return new ft(this.arr);
  }
  /**
   * @param {number} offset
   * @return {ContentAny}
   */
  splice(e) {
    const n = new ft(this.arr.slice(e));
    return this.arr = this.arr.slice(0, e), n;
  }
  /**
   * @param {ContentAny} right
   * @return {boolean}
   */
  mergeWith(e) {
    return this.arr = this.arr.concat(e.arr), !0;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(e, n) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    const s = this.arr.length;
    e.writeLen(s - n);
    for (let r = n; r < s; r++) {
      const i = this.arr[r];
      e.writeAny(i);
    }
  }
  /**
   * @return {number}
   */
  getRef() {
    return 8;
  }
}
const ep = (t) => {
  const e = t.readLen(), n = [];
  for (let s = 0; s < e; s++)
    n.push(t.readAny());
  return new ft(n);
};
class _e {
  /**
   * @param {string} str
   */
  constructor(e) {
    this.str = e;
  }
  /**
   * @return {number}
   */
  getLength() {
    return this.str.length;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return this.str.split("");
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentString}
   */
  copy() {
    return new _e(this.str);
  }
  /**
   * @param {number} offset
   * @return {ContentString}
   */
  splice(e) {
    const n = new _e(this.str.slice(e));
    this.str = this.str.slice(0, e);
    const s = this.str.charCodeAt(e - 1);
    return s >= 55296 && s <= 56319 && (this.str = this.str.slice(0, e - 1) + "�", n.str = "�" + n.str.slice(1)), n;
  }
  /**
   * @param {ContentString} right
   * @return {boolean}
   */
  mergeWith(e) {
    return this.str += e.str, !0;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(e, n) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    e.writeString(n === 0 ? this.str : this.str.slice(n));
  }
  /**
   * @return {number}
   */
  getRef() {
    return 4;
  }
}
const tp = (t) => new _e(t.readString()), np = [
  Of,
  Rf,
  Hf,
  Bf,
  zf,
  Kf,
  Wf
], sp = 0, rp = 1, ip = 2, op = 3, cp = 4, ap = 5, lp = 6;
class Oe {
  /**
   * @param {AbstractType<any>} type
   */
  constructor(e) {
    this.type = e;
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [this.type];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentType}
   */
  copy() {
    return new Oe(this.type._copy());
  }
  /**
   * @param {number} offset
   * @return {ContentType}
   */
  splice(e) {
    throw de();
  }
  /**
   * @param {ContentType} right
   * @return {boolean}
   */
  mergeWith(e) {
    return !1;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(e, n) {
    this.type._integrate(e.doc, n);
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
    let n = this.type._start;
    for (; n !== null; )
      n.deleted ? n.id.clock < (e.beforeState.get(n.id.client) || 0) && e._mergeStructs.push(n) : n.delete(e), n = n.right;
    this.type._map.forEach((s) => {
      s.deleted ? s.id.clock < (e.beforeState.get(s.id.client) || 0) && e._mergeStructs.push(s) : s.delete(e);
    }), e.changed.delete(this.type);
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
    let n = this.type._start;
    for (; n !== null; )
      n.gc(e, !0), n = n.right;
    this.type._start = null, this.type._map.forEach(
      /** @param {Item | null} item */
      (s) => {
        for (; s !== null; )
          s.gc(e, !0), s = s.left;
      }
    ), this.type._map = /* @__PURE__ */ new Map();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    this.type._write(e);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 7;
  }
}
const up = (t) => new Oe(np[t.readTypeRef()](t)), Es = (t, e, n) => {
  const { client: s, clock: r } = e.id, i = new P(
    A(s, r + n),
    e,
    A(s, r + n - 1),
    e.right,
    e.rightOrigin,
    e.parent,
    e.parentSub,
    e.content.splice(n)
  );
  return e.deleted && i.markDeleted(), e.keep && (i.keep = !0), e.redone !== null && (i.redone = A(e.redone.client, e.redone.clock + n)), e.right = i, i.right !== null && (i.right.left = i), t._mergeStructs.push(i), i.parentSub !== null && i.right === null && i.parent._map.set(i.parentSub, i), e.length = n, i;
};
class P extends Ti {
  /**
   * @param {ID} id
   * @param {Item | null} left
   * @param {ID | null} origin
   * @param {Item | null} right
   * @param {ID | null} rightOrigin
   * @param {AbstractType<any>|ID|null} parent Is a type if integrated, is null if it is possible to copy parent from left or right, is ID before integration to search for it.
   * @param {string | null} parentSub
   * @param {AbstractContent} content
   */
  constructor(e, n, s, r, i, o, c, a) {
    super(e, a.getLength()), this.origin = s, this.left = n, this.right = r, this.rightOrigin = i, this.parent = o, this.parentSub = c, this.redone = null, this.content = a, this.info = this.content.isCountable() ? yo : 0;
  }
  /**
   * This is used to mark the item as an indexed fast-search marker
   *
   * @type {boolean}
   */
  set marker(e) {
    (this.info & sr) > 0 !== e && (this.info ^= sr);
  }
  get marker() {
    return (this.info & sr) > 0;
  }
  /**
   * If true, do not garbage collect this Item.
   */
  get keep() {
    return (this.info & go) > 0;
  }
  set keep(e) {
    this.keep !== e && (this.info ^= go);
  }
  get countable() {
    return (this.info & yo) > 0;
  }
  /**
   * Whether this item was deleted or not.
   * @type {Boolean}
   */
  get deleted() {
    return (this.info & nr) > 0;
  }
  set deleted(e) {
    this.deleted !== e && (this.info ^= nr);
  }
  markDeleted() {
    this.info |= nr;
  }
  /**
   * Return the creator clientID of the missing op or define missing items and return null.
   *
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing(e, n) {
    if (this.origin && this.origin.client !== this.id.client && this.origin.clock >= j(n, this.origin.client))
      return this.origin.client;
    if (this.rightOrigin && this.rightOrigin.client !== this.id.client && this.rightOrigin.clock >= j(n, this.rightOrigin.client))
      return this.rightOrigin.client;
    if (this.parent && this.parent.constructor === Tt && this.id.client !== this.parent.client && this.parent.clock >= j(n, this.parent.client))
      return this.parent.client;
    if (this.origin && (this.left = Mo(e, n, this.origin), this.origin = this.left.lastId), this.rightOrigin && (this.right = Ke(e, this.rightOrigin), this.rightOrigin = this.right.id), this.left && this.left.constructor === re || this.right && this.right.constructor === re)
      this.parent = null;
    else if (!this.parent)
      this.left && this.left.constructor === P && (this.parent = this.left.parent, this.parentSub = this.left.parentSub), this.right && this.right.constructor === P && (this.parent = this.right.parent, this.parentSub = this.right.parentSub);
    else if (this.parent.constructor === Tt) {
      const s = ur(n, this.parent);
      s.constructor === re ? this.parent = null : this.parent = /** @type {ContentType} */
      s.content.type;
    }
    return null;
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(e, n) {
    if (n > 0 && (this.id.clock += n, this.left = Mo(e, e.doc.store, A(this.id.client, this.id.clock - 1)), this.origin = this.left.lastId, this.content = this.content.splice(n), this.length -= n), this.parent) {
      if (!this.left && (!this.right || this.right.left !== null) || this.left && this.left.right !== this.right) {
        let s = this.left, r;
        if (s !== null)
          r = s.right;
        else if (this.parentSub !== null)
          for (r = /** @type {AbstractType<any>} */
          this.parent._map.get(this.parentSub) || null; r !== null && r.left !== null; )
            r = r.left;
        else
          r = /** @type {AbstractType<any>} */
          this.parent._start;
        const i = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
        for (; r !== null && r !== this.right; ) {
          if (o.add(r), i.add(r), Wn(this.origin, r.origin)) {
            if (r.id.client < this.id.client)
              s = r, i.clear();
            else if (Wn(this.rightOrigin, r.rightOrigin))
              break;
          } else if (r.origin !== null && o.has(ur(e.doc.store, r.origin)))
            i.has(ur(e.doc.store, r.origin)) || (s = r, i.clear());
          else
            break;
          r = r.right;
        }
        this.left = s;
      }
      if (this.left !== null) {
        const s = this.left.right;
        this.right = s, this.left.right = this;
      } else {
        let s;
        if (this.parentSub !== null)
          for (s = /** @type {AbstractType<any>} */
          this.parent._map.get(this.parentSub) || null; s !== null && s.left !== null; )
            s = s.left;
        else
          s = /** @type {AbstractType<any>} */
          this.parent._start, this.parent._start = this;
        this.right = s;
      }
      this.right !== null ? this.right.left = this : this.parentSub !== null && (this.parent._map.set(this.parentSub, this), this.left !== null && this.left.delete(e)), this.parentSub === null && this.countable && !this.deleted && (this.parent._length += this.length), Ha(e.doc.store, this), this.content.integrate(e, this), Oo(
        e,
        /** @type {AbstractType<any>} */
        this.parent,
        this.parentSub
      ), /** @type {AbstractType<any>} */
      (this.parent._item !== null && /** @type {AbstractType<any>} */
      this.parent._item.deleted || this.parentSub !== null && this.right !== null) && this.delete(e);
    } else
      new re(this.id, this.length).integrate(e, 0);
  }
  /**
   * Returns the next non-deleted item
   */
  get next() {
    let e = this.right;
    for (; e !== null && e.deleted; )
      e = e.right;
    return e;
  }
  /**
   * Returns the previous non-deleted item
   */
  get prev() {
    let e = this.left;
    for (; e !== null && e.deleted; )
      e = e.left;
    return e;
  }
  /**
   * Computes the last content address of this Item.
   */
  get lastId() {
    return this.length === 1 ? this.id : A(this.id.client, this.id.clock + this.length - 1);
  }
  /**
   * Try to merge two items
   *
   * @param {Item} right
   * @return {boolean}
   */
  mergeWith(e) {
    if (this.constructor === e.constructor && Wn(e.origin, this.lastId) && this.right === e && Wn(this.rightOrigin, e.rightOrigin) && this.id.client === e.id.client && this.id.clock + this.length === e.id.clock && this.deleted === e.deleted && this.redone === null && e.redone === null && this.content.constructor === e.content.constructor && this.content.mergeWith(e.content)) {
      const n = (
        /** @type {AbstractType<any>} */
        this.parent._searchMarker
      );
      return n && n.forEach((s) => {
        s.p === e && (s.p = this, !this.deleted && this.countable && (s.index -= this.length));
      }), e.keep && (this.keep = !0), this.right = e.right, this.right !== null && (this.right.left = this), this.length += e.length, !0;
    }
    return !1;
  }
  /**
   * Mark this Item as deleted.
   *
   * @param {Transaction} transaction
   */
  delete(e) {
    if (!this.deleted) {
      const n = (
        /** @type {AbstractType<any>} */
        this.parent
      );
      this.countable && this.parentSub === null && (n._length -= this.length), this.markDeleted(), ws(e.deleteSet, this.id.client, this.id.clock, this.length), Oo(e, n, this.parentSub), this.content.delete(e);
    }
  }
  /**
   * @param {StructStore} store
   * @param {boolean} parentGCd
   */
  gc(e, n) {
    if (!this.deleted)
      throw ce();
    this.content.gc(e), n ? yf(e, this, new re(this.id, this.length)) : this.content = new wn(this.length);
  }
  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   * @param {number} offset
   */
  write(e, n) {
    const s = n > 0 ? A(this.id.client, this.id.clock + n - 1) : this.origin, r = this.rightOrigin, i = this.parentSub, o = this.content.getRef() & Ms | (s === null ? 0 : ie) | // origin is defined
    (r === null ? 0 : De) | // right origin is defined
    (i === null ? 0 : un);
    if (e.writeInfo(o), s !== null && e.writeLeftID(s), r !== null && e.writeRightID(r), s === null && r === null) {
      const c = (
        /** @type {AbstractType<any>} */
        this.parent
      );
      if (c._item !== void 0) {
        const a = c._item;
        if (a === null) {
          const l = pf(c);
          e.writeParentInfo(!0), e.writeString(l);
        } else
          e.writeParentInfo(!1), e.writeLeftID(a.id);
      } else c.constructor === String ? (e.writeParentInfo(!0), e.writeString(c)) : c.constructor === Tt ? (e.writeParentInfo(!1), e.writeLeftID(c)) : ce();
      i !== null && e.writeString(i);
    }
    this.content.write(e, n);
  }
}
const cl = (t, e) => hp[e & Ms](t), hp = [
  () => {
    ce();
  },
  // GC is not ItemContent
  qf,
  // 1
  Qf,
  // 2
  Gf,
  // 3
  tp,
  // 4
  Xf,
  // 5
  Zf,
  // 6
  up,
  // 7
  ep,
  // 8
  Jf,
  // 9
  () => {
    ce();
  }
  // 10 - Skip is not ItemContent
], dp = 10;
class oe extends Ti {
  get deleted() {
    return !0;
  }
  delete() {
  }
  /**
   * @param {Skip} right
   * @return {boolean}
   */
  mergeWith(e) {
    return this.constructor !== e.constructor ? !1 : (this.length += e.length, !0);
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(e, n) {
    ce();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    e.writeInfo(dp), b(e.restEncoder, this.length - n);
  }
  /**
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing(e, n) {
    return null;
  }
}
const al = (
  /** @type {any} */
  typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : {}
), ll = "__ $YJS$ __";
al[ll] === !0 && console.error("Yjs was already imported. This breaks constructor checks and will lead to issues! - https://github.com/yjs/yjs/issues/438");
al[ll] = !0;
const fr = 3e4;
class fp extends ea {
  /**
   * @param {Y.Doc} doc
   */
  constructor(e) {
    super(), this.doc = e, this.clientID = e.clientID, this.states = /* @__PURE__ */ new Map(), this.meta = /* @__PURE__ */ new Map(), this._checkInterval = /** @type {any} */
    setInterval(() => {
      const n = $t();
      this.getLocalState() !== null && fr / 2 <= n - /** @type {{lastUpdated:number}} */
      this.meta.get(this.clientID).lastUpdated && this.setLocalState(this.getLocalState());
      const s = [];
      this.meta.forEach((r, i) => {
        i !== this.clientID && fr <= n - r.lastUpdated && this.states.has(i) && s.push(i);
      }), s.length > 0 && Li(this, s, "timeout");
    }, pe(fr / 10)), e.on("destroy", () => {
      this.destroy();
    }), this.setLocalState({});
  }
  destroy() {
    this.emit("destroy", [this]), this.setLocalState(null), super.destroy(), clearInterval(this._checkInterval);
  }
  /**
   * @return {Object<string,any>|null}
   */
  getLocalState() {
    return this.states.get(this.clientID) || null;
  }
  /**
   * @param {Object<string,any>|null} state
   */
  setLocalState(e) {
    const n = this.clientID, s = this.meta.get(n), r = s === void 0 ? 0 : s.clock + 1, i = this.states.get(n);
    e === null ? this.states.delete(n) : this.states.set(n, e), this.meta.set(n, {
      clock: r,
      lastUpdated: $t()
    });
    const o = [], c = [], a = [], l = [];
    e === null ? l.push(n) : i == null ? e != null && o.push(n) : (c.push(n), xt(i, e) || a.push(n)), (o.length > 0 || a.length > 0 || l.length > 0) && this.emit("change", [{ added: o, updated: a, removed: l }, "local"]), this.emit("update", [{ added: o, updated: c, removed: l }, "local"]);
  }
  /**
   * @param {string} field
   * @param {any} value
   */
  setLocalStateField(e, n) {
    const s = this.getLocalState();
    s !== null && this.setLocalState({
      ...s,
      [e]: n
    });
  }
  /**
   * @return {Map<number,Object<string,any>>}
   */
  getStates() {
    return this.states;
  }
}
const Li = (t, e, n) => {
  const s = [];
  for (let r = 0; r < e.length; r++) {
    const i = e[r];
    if (t.states.has(i)) {
      if (t.states.delete(i), i === t.clientID) {
        const o = (
          /** @type {MetaClientState} */
          t.meta.get(i)
        );
        t.meta.set(i, {
          clock: o.clock + 1,
          lastUpdated: $t()
        });
      }
      s.push(i);
    }
  }
  s.length > 0 && (t.emit("change", [{ added: [], updated: [], removed: s }, n]), t.emit("update", [{ added: [], updated: [], removed: s }, n]));
}, nn = (t, e, n = t.states) => {
  const s = e.length, r = Y();
  b(r, s);
  for (let i = 0; i < s; i++) {
    const o = e[i], c = n.get(o) || null, a = (
      /** @type {MetaClientState} */
      t.meta.get(o).clock
    );
    b(r, o), b(r, a), ct(r, JSON.stringify(c));
  }
  return T(r);
}, pp = (t, e, n) => {
  const s = qe(e), r = $t(), i = [], o = [], c = [], a = [], l = S(s);
  for (let u = 0; u < l; u++) {
    const h = S(s);
    let d = S(s);
    const f = JSON.parse(He(s)), p = t.meta.get(h), g = t.states.get(h), m = p === void 0 ? 0 : p.clock;
    (m < d || m === d && f === null && t.states.has(h)) && (f === null ? h === t.clientID && t.getLocalState() != null ? d++ : t.states.delete(h) : t.states.set(h, f), t.meta.set(h, {
      clock: d,
      lastUpdated: r
    }), p === void 0 && f !== null ? i.push(h) : p !== void 0 && f === null ? a.push(h) : f !== null && (xt(f, g) || c.push(h), o.push(h)));
  }
  (i.length > 0 || c.length > 0 || a.length > 0) && t.emit("change", [{
    added: i,
    updated: c,
    removed: a
  }, n]), (i.length > 0 || o.length > 0 || a.length > 0) && t.emit("update", [{
    added: i,
    updated: o,
    removed: a
  }, n]);
}, ul = 0, Ii = 1, hl = 2, Fr = (t, e) => {
  b(t, ul);
  const n = df(e);
  I(t, n);
}, dl = (t, e, n) => {
  b(t, Ii), I(t, af(e, n));
}, gp = (t, e, n) => dl(e, n, W(t)), fl = (t, e, n, s) => {
  try {
    rf(e, W(t), n);
  } catch (r) {
    s?.(
      /** @type {Error} */
      r
    ), console.error("Caught error while handling a Yjs update", r);
  }
}, yp = (t, e) => {
  b(t, hl), I(t, e);
}, mp = fl, wp = (t, e, n, s, r) => {
  const i = S(t);
  switch (i) {
    case ul:
      gp(t, e, n);
      break;
    case Ii:
      fl(t, n, s, r);
      break;
    case hl:
      mp(t, n, s, r);
      break;
    default:
      throw new Error("Unknown message type");
  }
  return i;
}, pl = /* @__PURE__ */ new Map();
class bp {
  /**
   * @param {string} room
   */
  constructor(e) {
    this.room = e, this.onmessage = null, this._onChange = (n) => n.key === e && this.onmessage !== null && this.onmessage({ data: Qh(n.newValue || "") }), jh(this._onChange);
  }
  /**
   * @param {ArrayBuffer} buf
   */
  postMessage(e) {
    ra.setItem(this.room, Zh(Yh(e)));
  }
  close() {
    Hh(this._onChange);
  }
}
const vp = typeof BroadcastChannel > "u" ? bp : BroadcastChannel, Mi = (t) => ke(pl, t, () => {
  const e = Ve(), n = new vp(t);
  return n.onmessage = (s) => e.forEach((r) => r(s.data, "broadcastchannel")), {
    bc: n,
    subs: e
  };
}), Cp = (t, e) => (Mi(t).subs.add(e), e), Sp = (t, e) => {
  const n = Mi(t), s = n.subs.delete(e);
  return s && n.subs.size === 0 && (n.bc.close(), pl.delete(t)), s;
}, At = (t, e, n = null) => {
  const s = Mi(t);
  s.bc.postMessage(e), s.subs.forEach((r) => r(e, n));
}, Ep = (t) => Ih(t, (e, n) => `${encodeURIComponent(n)}=${encodeURIComponent(e)}`).join("&");
let _p = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", Ap = (t = 21) => {
  let e = "", n = crypto.getRandomValues(new Uint8Array(t |= 0));
  for (; t--; )
    e += _p[n[t] & 63];
  return e;
};
const kp = 0, xp = (t, e, n) => {
  S(t) === kp && n(e, He(t));
}, Dp = typeof window > "u", Un = [];
Un[0] = (t, e, n, s, r) => {
  b(t, 0);
  const i = wp(
    e,
    t,
    n.doc,
    n
  );
  s && i === Ii && !n.synced && (n.synced = !0);
};
Un[3] = (t, e, n, s, r) => {
  b(t, 1), I(
    t,
    nn(
      n.awareness,
      Array.from(n.awareness.getStates().keys())
    )
  );
};
Un[1] = (t, e, n, s, r) => {
  pp(
    n.awareness,
    W(e),
    n
  );
};
Un[2] = (t, e, n, s, r) => {
  xp(
    e,
    n.doc,
    (i, o) => Tp(n, o)
  );
};
function Tp(t, e) {
  console.warn(`Permission denied to access ${t.url}.
${e}`);
}
function gl(t, e, n) {
  const s = qe(e), r = Y(), i = S(s), o = t.messageHandlers[i];
  return o ? o(r, s, t, n, i) : console.error("Unable to compute message"), r;
}
function Fo(t) {
  if (t.shouldConnect && t.ws === null) {
    if (!t._WS)
      throw new Error(
        "No WebSocket implementation available, did you forget to pass options.WebSocketPolyfill?"
      );
    const e = new t._WS(t.url);
    e.binaryType = "arraybuffer", t.ws = e, t.wsconnecting = !0, t.wsconnected = !1, t.synced = !1, e.addEventListener("message", (n) => {
      if (typeof n.data == "string") {
        if (n.data.startsWith("__YPS:")) {
          const r = n.data.slice(6);
          t.emit("custom-message", [r]);
        }
        return;
      }
      t.wsLastMessageReceived = $t();
      const s = gl(t, new Uint8Array(n.data), !0);
      oi(s) > 1 && e.send(T(s));
    }), e.addEventListener("error", (n) => {
      t.emit("connection-error", [n, t]);
    }), e.addEventListener("close", (n) => {
      if (t.emit("connection-close", [n, t]), t.ws = null, t.wsconnecting = !1, t.wsconnected) {
        t.wsconnected = !1, t.synced = !1;
        const s = Array.from(
          t.awareness.getStates().keys()
        ).filter((r) => r !== t.doc.clientID);
        Li(
          t.awareness,
          s,
          t
        );
        for (const r of s)
          t.awareness.meta.delete(r);
        t.emit("status", [{ status: "disconnected" }]);
      } else t.wsUnsuccessfulReconnects++;
      setTimeout(
        () => {
          t.shouldConnect && Promise.resolve(t._reconnectWS()).catch((s) => {
            console.error("Reconnection failed", s);
          });
        },
        ri(
          Gu(2, t.wsUnsuccessfulReconnects) * 100,
          t.maxBackoffTime
        )
      );
    }), e.addEventListener("open", () => {
      t.wsLastMessageReceived = $t(), t.wsconnecting = !1, t.wsconnected = !0, t.wsUnsuccessfulReconnects = 0, t.emit("status", [{ status: "connected" }]);
      const n = Y();
      if (b(n, 0), Fr(n, t.doc), e.send(T(n)), t.awareness.getLocalState() !== null) {
        t.awareness.setLocalState(t.awareness.getLocalState());
        const s = Y();
        b(s, 1), I(
          s,
          nn(t.awareness, [
            t.doc.clientID
          ])
        ), e.send(T(s));
      }
    }), t.emit("status", [{ status: "connecting" }]);
  }
}
function pr(t, e) {
  const n = t.ws;
  t.wsconnected && n && n.readyState === n.OPEN && n.send(e), t.bcconnected && At(t.bcChannel, e, t);
}
const Lp = typeof WebSocket > "u" ? null : WebSocket;
var Ip = class extends ea {
  maxBackoffTime;
  bcChannel;
  url;
  roomname;
  doc;
  _WS;
  awareness;
  wsconnected;
  wsconnecting;
  bcconnected;
  disableBc;
  wsUnsuccessfulReconnects;
  messageHandlers;
  _synced;
  ws;
  wsLastMessageReceived;
  shouldConnect;
  _resyncInterval;
  _bcSubscriber;
  _updateHandler;
  _awarenessUpdateHandler;
  _unloadHandler;
  constructor(t, e, n, {
    connect: s = !0,
    awareness: r = new fp(n),
    params: i = {},
    isPrefixedUrl: o = !1,
    WebSocketPolyfill: c = Lp,
    resyncInterval: a = -1,
    maxBackoffTime: l = 2500,
    disableBc: u = Dp
  } = {}) {
    for (super(); t[t.length - 1] === "/"; )
      t = t.slice(0, t.length - 1);
    const h = Ep(i);
    this.maxBackoffTime = l, this.bcChannel = `${t}/${e}`, this.url = o ? t : `${t}/${e}${h.length === 0 ? "" : `?${h}`}`, this.roomname = e, this.doc = n, this._WS = c, this.awareness = r, this.wsconnected = !1, this.wsconnecting = !1, this.bcconnected = !1, this.disableBc = u, this.wsUnsuccessfulReconnects = 0, this.messageHandlers = Un.slice(), this._synced = !1, this.ws = null, this.wsLastMessageReceived = 0, this.shouldConnect = s, this._resyncInterval = 0, a > 0 && (this._resyncInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const d = Y();
        b(d, 0), Fr(d, n), this.ws.send(T(d));
      }
    }, a)), this._bcSubscriber = (d, f) => {
      if (f !== this) {
        const p = gl(this, new Uint8Array(d), !1);
        oi(p) > 1 && At(this.bcChannel, T(p), this);
      }
    }, this._updateHandler = (d, f) => {
      if (f !== this) {
        const p = Y();
        b(p, 0), yp(p, d), pr(this, T(p));
      }
    }, this.doc.on("update", this._updateHandler), this._awarenessUpdateHandler = ({ added: d, updated: f, removed: p }, g) => {
      const m = d.concat(f).concat(p), w = Y();
      b(w, 1), I(
        w,
        nn(r, m)
      ), pr(this, T(w));
    }, this._unloadHandler = () => {
      Li(
        this.awareness,
        [n.clientID],
        "window unload"
      );
    }, typeof window < "u" ? window.addEventListener("unload", this._unloadHandler) : typeof process < "u" && typeof process.on == "function" && process.on("exit", this._unloadHandler), r.on("change", this._awarenessUpdateHandler), clearInterval(r._checkInterval), s && this.connect();
  }
  /**
   * @type {boolean}
   */
  get synced() {
    return this._synced;
  }
  set synced(t) {
    this._synced !== t && (this._synced = t, this.emit("synced", [t]), this.emit("sync", [t]));
  }
  destroy() {
    this._resyncInterval !== 0 && clearInterval(this._resyncInterval), this.disconnect(), typeof window < "u" ? window.removeEventListener("unload", this._unloadHandler) : typeof process < "u" && typeof process.off == "function" && process.off("exit", this._unloadHandler), this.awareness.off("change", this._awarenessUpdateHandler), this.doc.off("update", this._updateHandler), super.destroy();
  }
  connectBc() {
    if (this.disableBc) return;
    this.bcconnected || (Cp(this.bcChannel, this._bcSubscriber), this.bcconnected = !0);
    const t = Y();
    b(t, 0), Fr(t, this.doc), At(this.bcChannel, T(t), this);
    const e = Y();
    b(e, 0), dl(e, this.doc), At(this.bcChannel, T(e), this);
    const n = Y();
    b(n, 3), At(
      this.bcChannel,
      T(n),
      this
    );
    const s = Y();
    b(s, 1), I(
      s,
      nn(this.awareness, [
        this.doc.clientID
      ])
    ), At(
      this.bcChannel,
      T(s),
      this
    );
  }
  disconnectBc() {
    const t = Y();
    b(t, 1), I(
      t,
      nn(
        this.awareness,
        [this.doc.clientID],
        /* @__PURE__ */ new Map()
      )
    ), pr(this, T(t)), this.bcconnected && (Sp(this.bcChannel, this._bcSubscriber), this.bcconnected = !1);
  }
  disconnect() {
    this.shouldConnect = !1, this.disconnectBc(), this.ws !== null && this.ws.close();
  }
  /**
   * Called by the close handler to re-establish the WebSocket.
   * Subclasses (e.g. YProvider) override this to refresh dynamic
   * params before reconnecting.
   */
  _reconnectWS() {
    Fo(this);
  }
  connect() {
    this.shouldConnect = !0, !this.wsconnected && this.ws === null && (Fo(this), this.connectBc());
  }
};
function jo(t, e, n) {
  if (typeof t !== n)
    throw new Error(
      `Invalid "${e}" parameter provided to YProvider. Expected: ${n}, received: ${t}`
    );
}
var $i = class extends Ip {
  id;
  #e;
  constructor(t, e, n, s = {}) {
    jo(t, "host", "string"), jo(e, "room", "string"), t = t.replace(/^(http|https|ws|wss):\/\//, ""), t.endsWith("/") && (t = t.slice(0, -1));
    const r = `${s.protocol || (t.startsWith("localhost:") || t.startsWith("127.0.0.1:") || t.startsWith("192.168.") || t.startsWith("10.") || t.startsWith("172.") && t.split(".")[1] >= "16" && t.split(".")[1] <= "31" ? "ws" : "wss")}://${t}${s.prefix || `/parties/${s.party || "main"}`}`, i = s.connectionId ?? Ap(10), { params: o, connect: c = !0, ...a } = s, l = {
      ...a,
      isPrefixedUrl: !!s.prefix,
      connect: !1
    };
    super(r, e, n ?? new me(), l), this.id = i, this.#e = o, c && this.connect();
  }
  async #t() {
    const t = typeof this.#e == "function" ? await this.#e() : this.#e, e = new URLSearchParams([["_pk", this.id]]);
    if (t)
      for (const [s, r] of Object.entries(t))
        r != null && e.append(s, r);
    const n = new URL(this.url);
    n.search = e.toString(), this.url = n.toString();
  }
  async connect() {
    try {
      await this.#t(), super.connect();
    } catch (t) {
      throw console.error("Failed to open connecton to PartyServer", t), t;
    }
  }
  async _reconnectWS() {
    try {
      await this.#t();
    } catch (t) {
      console.error(
        "Failed to refresh params, reconnecting with stale params",
        t
      );
    }
    super._reconnectWS();
  }
  sendMessage(t) {
    this.ws?.send(`__YPS:${t}`);
  }
};
const yl = ["data-playhtml-hover", "data-playhtml-focus"], Mp = [
  "__playhtml-element",
  "ph-flash",
  "ph-inspect-highlight",
  "ph-inspect-highlight-hover",
  "ph-inspect-selected",
  "playhtml-loading"
], $p = {
  "aria-busy": "true",
  "aria-live": "polite"
}, Op = {
  defaultData: (t) => sn(t),
  myDefaultAwareness: { hover: !1, focus: !1 },
  onMount: ({ getElement: t, setData: e, setMyAwareness: n }) => {
    const s = t(), r = e, i = Pp(s, (a) => {
      const l = a.filter(
        (u) => u.type !== "attributes" || !yl.includes(u.attributeName || "")
      );
      l.length !== 0 && r((u) => {
        Rp(u, l);
      });
    });
    s.__playhtml_observer = i, s.addEventListener("mouseenter", () => {
      n({ hover: !0, focus: s.hasAttribute("data-playhtml-focus") }), s.setAttribute("data-playhtml-hover", "");
    }), s.addEventListener("mouseleave", () => {
      n({ hover: !1, focus: s.hasAttribute("data-playhtml-focus") }), s.removeAttribute("data-playhtml-hover");
    }), s.addEventListener("focusin", () => {
      n({ hover: s.hasAttribute("data-playhtml-hover"), focus: !0 }), s.setAttribute("data-playhtml-focus", "");
    }), s.addEventListener("focusout", () => {
      n({ hover: s.hasAttribute("data-playhtml-hover"), focus: !1 }), s.removeAttribute("data-playhtml-focus");
    });
    const o = (a, l) => {
      if (a.formState && (l.formState = a.formState), a.children && l.children)
        for (let u = 0; u < a.children.length; u++) {
          const h = a.children[u];
          h.nodeType === "HTMLElement" && l.children[u] && o(
            h,
            l.children[u]
          );
        }
    }, c = () => {
      r((a) => {
        const l = sn(s);
        o(l, a), l.children && a.children.splice(0, a.children.length, ...l.children);
      });
    };
    s.addEventListener("input", c), s.addEventListener("change", c);
  },
  updateElement: ({ element: t, data: e }) => {
    const n = sn(t);
    if (Oi(n, e))
      return;
    const s = t.__playhtml_observer;
    s && (s.takeRecords(), s.disconnect()), us(t, e), s && s.observe(t, {
      childList: !0,
      attributes: !0,
      subtree: !1,
      characterData: !0
    });
  },
  updateElementAwareness: ({ element: t, awareness: e }) => {
    const n = e.some((r) => r?.hover), s = e.some((r) => r?.focus);
    n ? t.setAttribute("data-playhtml-hover", "") : t.removeAttribute("data-playhtml-hover"), s ? t.setAttribute("data-playhtml-focus", "") : t.removeAttribute("data-playhtml-focus");
  }
};
function Ho(t) {
  return t.nodeType === "HTMLElement";
}
function Oi(t, e) {
  if (t.nodeType !== e.nodeType)
    return !1;
  if (t.nodeType === "Text" && e.nodeType === "Text")
    return t.textContent === e.textContent;
  if (Ho(t) && Ho(e)) {
    if (t.tagName !== e.tagName)
      return !1;
    const n = jr(t.attributes), s = jr(e.attributes);
    if (Object.keys(n).length !== Object.keys(s).length)
      return !1;
    for (const [a, l] of Object.entries(n))
      if (s[a] !== l)
        return !1;
    const r = t.formState, i = e.formState;
    if ((r || i) && (!r || !i || r.checked !== i.checked || r.value !== i.value || r.selectedIndex !== i.selectedIndex))
      return !1;
    const o = _s(t.children), c = _s(e.children);
    if (o.length !== c.length)
      return !1;
    for (let a = 0; a < o.length; a++)
      if (!Oi(o[a], c[a]))
        return !1;
  }
  return !0;
}
function Pp(t, e, n) {
  const s = { childList: !0, attributes: !0, subtree: !1, characterData: !0, ...n }, r = (o) => {
    const c = o.filter((a) => {
      if (a.target !== t)
        return !1;
      if (s.childList && a.type === "childList")
        return !0;
      if (s.attributes && a.type === "attributes")
        if (s.attributeFilter) {
          if (s.attributeFilter.includes(a.attributeName || ""))
            return !0;
        } else
          return !0;
      return !!(s.characterData && a.type === "characterData" || s.subtree && a.type === "childList");
    });
    e(c);
  }, i = new MutationObserver(r);
  return i.observe(t, s), i;
}
function Rp(t, e) {
  e.forEach((n) => {
    switch (n.type) {
      case "attributes":
        Np(t, n);
        break;
      case "childList":
        Up(t, n);
        break;
      case "characterData":
        Fp(t, n);
        break;
    }
  });
}
function Np(t, e) {
  if (t.nodeType !== "Text" && e.target instanceof HTMLElement) {
    const n = e.attributeName, s = e.target.getAttribute(n), r = Ni(e.target);
    if (s !== null) {
      const i = Ui(
        n,
        s,
        r
      );
      i === null ? n in t.attributes && delete t.attributes[n] : t.attributes[n] !== i && (t.attributes[n] = i);
    } else n in t.attributes && delete t.attributes[n];
  }
}
function Up(t, e) {
  if (t.nodeType === "Text" || !(e.target instanceof HTMLElement))
    return;
  const n = [];
  e.target.childNodes.forEach((r) => {
    Pi(r) && n.push(sn(r));
  });
  const s = _s(t.children);
  s.length === t.children.length && zp(s, n) || t.children.splice(0, t.children.length, ...n);
}
function Fp(t, e) {
  const n = e.target;
  switch (t.nodeType) {
    case "Text":
      if (n instanceof Text)
        return t.textContent = n.textContent || "", !0;
      break;
  }
  return !1;
}
function jp(t) {
  return t instanceof HTMLElement || t instanceof Text;
}
function ml(t) {
  return t instanceof HTMLElement && t.classList.contains("ph-inspect-label");
}
function Pi(t) {
  return jp(t) && !ml(t);
}
function Ri(t, e) {
  return !!t?.split(/\s+/).includes(e);
}
function Hp(t) {
  return t.nodeType === "HTMLElement" && Ri(t.attributes.class, "ph-inspect-label");
}
function _s(t) {
  return t.filter((e) => !Hp(e));
}
function zp(t, e) {
  return t.length !== e.length ? !1 : t.every(
    (n, s) => Oi(n, e[s])
  );
}
function wl(t, e) {
  const n = new Set(Mp);
  return e && Ri(t, "playhtml-loading") && n.add(e), n;
}
function Ni(t) {
  const e = t.getAttribute("class") || void 0;
  return {
    classValue: e,
    localClassNames: wl(
      e,
      t.getAttribute("loading-class")
    )
  };
}
function Bp(t) {
  return {
    classValue: t.class,
    localClassNames: wl(
      t.class,
      t["loading-class"]
    )
  };
}
function bl(t, e, n) {
  return yl.includes(t) ? !0 : Ri(n.classValue, "playhtml-loading") && $p[t] === e;
}
function Ui(t, e, n) {
  return bl(t, e, n) ? null : t === "class" ? Vp(
    e,
    n.localClassNames
  ) || null : e;
}
function jr(t) {
  const e = {}, n = Bp(t);
  for (const [s, r] of Object.entries(t)) {
    const i = Ui(s, r, n);
    i !== null && (e[s] = i);
  }
  return e;
}
function Vp(t, e) {
  return t.split(/\s+/).filter((n) => n && !e.has(n)).join(" ");
}
function vl(t, e) {
  return t.split(/\s+/).filter((n) => e.has(n)).join(" ");
}
function Kp(t, e, n) {
  const s = [
    ...t.split(/\s+/).filter(Boolean),
    ...vl(e, n).split(/\s+/).filter(Boolean)
  ];
  return Array.from(new Set(s)).join(" ");
}
function Wp(t) {
  if (t instanceof HTMLInputElement) {
    const e = {};
    return t.type === "checkbox" || t.type === "radio" ? e.checked = t.checked : e.value = t.value, e;
  }
  if (t instanceof HTMLTextAreaElement)
    return { value: t.value };
  if (t instanceof HTMLSelectElement)
    return { selectedIndex: t.selectedIndex, value: t.value };
}
function sn(t) {
  if (t instanceof Text)
    return {
      nodeType: "Text",
      textContent: t.textContent || ""
    };
  const e = {
    nodeType: "HTMLElement",
    tagName: t.tagName.toLowerCase(),
    attributes: {},
    children: []
  }, n = Ni(t);
  for (const r of t.attributes) {
    const i = Ui(
      r.name,
      r.value,
      n
    );
    i !== null && (e.attributes[r.name] = i);
  }
  const s = Wp(t);
  return s && (e.formState = s), t.childNodes.forEach((r) => {
    Pi(r) && e.children.push(sn(r));
  }), e;
}
function Yp(t, e) {
  e && (t instanceof HTMLInputElement ? (t.type === "checkbox" || t.type === "radio") && e.checked !== void 0 ? t.checked = e.checked : e.value !== void 0 && (t.value = e.value) : t instanceof HTMLTextAreaElement && e.value !== void 0 ? t.value = e.value : t instanceof HTMLSelectElement && e.selectedIndex !== void 0 && (t.selectedIndex = e.selectedIndex));
}
function us(t, e) {
  Gp(t, e), e.nodeType === "HTMLElement" && (qp(t, e), Yp(t, e.formState), Xp(t, e));
}
function Gp(t, e) {
  e && e.nodeType === "Text" && t.textContent !== e.textContent && (t.textContent = e.textContent || "");
}
function qp(t, e) {
  if (!e)
    return;
  const n = e.attributes && typeof e.attributes == "object" ? jr(e.attributes) : {}, s = Ni(t);
  for (const [r, i] of Object.entries(n)) {
    const o = r === "class" ? Kp(
      i,
      t.getAttribute("class") || "",
      s.localClassNames
    ) : i;
    t.getAttribute(r) !== o && t.setAttribute(r, o);
  }
  Array.from(t.attributes).forEach((r) => {
    if (!bl(r.name, r.value, s)) {
      if (r.name === "class") {
        const i = vl(
          r.value,
          s.localClassNames
        );
        if (!("class" in n) && i) {
          t.setAttribute("class", i);
          return;
        }
      }
      r.name in n || t.removeAttribute(r.name);
    }
  });
}
function zo(t) {
  return t.nodeType === "Text" ? document.createTextNode(t.textContent) : document.createElement(t.tagName);
}
function Jp(t, e) {
  return e.nodeType === "Text" ? t instanceof Text : t instanceof HTMLElement && t.tagName.toLowerCase() === e.tagName;
}
function Xp(t, e) {
  const n = Array.from(t.childNodes).filter(Pi), s = _s(e.children), r = Math.min(n.length, s.length);
  for (let i = 0; i < r; i++) {
    const o = n[i], c = s[i];
    if (Jp(o, c))
      us(o, c);
    else {
      const a = zo(c);
      t.replaceChild(a, o), us(a, c);
    }
  }
  for (let i = r; i < s.length; i++) {
    const o = s[i], c = zo(o), a = Array.from(t.childNodes).find(ml);
    t.insertBefore(c, a ?? null), us(c, o);
  }
  for (let i = n.length - 1; i >= r; i--)
    t.removeChild(n[i]);
}
const Hr = 16, et = 512, Cl = /[\u0000-\u001f\u007f]/, Zp = 150;
function Qp() {
  return `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
}
function Bo(t) {
  return t !== null && typeof t == "object" && !Array.isArray(t);
}
function Sl(t) {
  if (!Bo(t) || !Vo(t.publicKey))
    return null;
  const e = Bo(t.playerStyle) ? t.playerStyle : {}, n = Array.isArray(e.colorPalette) ? e.colorPalette.filter(Vo).slice(0, Hr) : [], s = {
    publicKey: t.publicKey,
    playerStyle: { colorPalette: n }
  }, r = Ko(t.name);
  r !== void 0 && (s.name = r);
  const i = Ko(e.cursorStyle);
  return i !== void 0 && (s.playerStyle.cursorStyle = i), Number.isFinite(t.createdAt) && (s.createdAt = Number(t.createdAt)), s;
}
function Vo(t) {
  return typeof t == "string" && t.length > 0 && t.length <= et && !Cl.test(t);
}
function Ko(t) {
  if (typeof t == "string" && !Cl.test(t))
    return t.slice(0, et);
}
function eg() {
  const t = crypto.getRandomValues(new Uint8Array(16)).reduce((s, r) => s + r.toString(16).padStart(2, "0"), ""), e = Math.floor(Math.random() * 360), n = [
    `hsl(${e}, 70%, 60%)`,
    `hsl(${(e + 120) % 360}, 70%, 60%)`,
    `hsl(${(e + 240) % 360}, 70%, 60%)`
  ];
  return {
    publicKey: t,
    playerStyle: {
      colorPalette: n
    },
    createdAt: Date.now()
  };
}
function tg(t) {
  const e = t.playerStyle?.colorPalette?.[0];
  return typeof e == "string" && e.length > 0;
}
function zr(t) {
  try {
    localStorage.setItem(
      El,
      JSON.stringify(t)
    );
  } catch (e) {
    console.warn("Failed to save player identity to localStorage:", e);
  }
}
function ng(t) {
  return tg(t) ? !1 : (t.playerStyle || (t.playerStyle = { colorPalette: [] }), Array.isArray(t.playerStyle.colorPalette) || (t.playerStyle.colorPalette = []), t.playerStyle.colorPalette[0] = Qp(), !0);
}
const El = "playhtml_player_identity";
let qn = null;
function _l() {
  if (qn) return qn;
  const t = localStorage.getItem(El);
  if (t)
    try {
      const n = JSON.parse(t), s = Sl(n);
      if (s)
        return (ng(s) || JSON.stringify(s) !== JSON.stringify(n)) && zr(s), qn = s, s;
    } catch {
      console.warn(
        "Failed to parse stored player identity, generating new one"
      );
    }
  const e = eg();
  return zr(e), qn = e, e;
}
const Fi = 512, As = 4096;
function gr(t) {
  if (!z(t))
    throw new Error("Presence message must be an object");
  switch (t.type) {
    case "presence-join":
      return sg(t), t;
    case "presence-update":
      return Yo(t.channel), rg(t.channel, t.value), t;
    case "presence-clear":
      return Yo(t.channel), t;
    default:
      throw new Error("Unsupported presence message type");
  }
}
function sg(t) {
  Dl(t), ks(t.page, "page", Fi), t.identity !== void 0 && Al(t.identity);
}
function rg(t, e) {
  if (e === void 0)
    throw new Error("Presence value must not be undefined");
  Dl(e), t === "cursor" && ig(e), t === "identity" && Al(e);
}
function ig(t) {
  if (!z(t))
    throw new Error("cursor presence value must be an object");
  if (!("cursor" in t))
    throw new Error("cursor presence value must include cursor");
  if (t.cursor !== null && ag(t.cursor), t.zone !== void 0 && t.zone !== null && lg(t.zone), ks(t.page, "page", Fi), t.at !== void 0 && !Number.isFinite(t.at))
    throw new Error("cursor at must be a finite number");
}
function og(t) {
  try {
    return kl(t), !0;
  } catch {
    return !1;
  }
}
function Al(t) {
  kl(t);
}
function kl(t) {
  if (!z(t))
    throw new Error("identity must be an object");
  if (Wo(
    t,
    ["publicKey", "name", "playerStyle", "createdAt"],
    "identity"
  ), yr(
    t.publicKey,
    "identity.publicKey",
    et
  ), !z(t.playerStyle))
    throw new Error("identity.playerStyle must be an object");
  Wo(
    t.playerStyle,
    ["colorPalette", "cursorStyle"],
    "identity.playerStyle"
  );
  const e = t.playerStyle.colorPalette;
  if (!Array.isArray(e))
    throw new Error("identity.playerStyle.colorPalette must be an array");
  if (e.length > Hr)
    throw new Error(
      `identity.playerStyle.colorPalette must have ${Hr} colors or less`
    );
  yr(
    e[0],
    "identity.playerStyle.colorPalette[0]",
    et
  );
  for (let n = 1; n < e.length; n++)
    yr(
      e[n],
      `identity.playerStyle.colorPalette[${n}]`,
      et
    );
  if (ks(
    t.name,
    "identity.name",
    et
  ), ks(
    t.playerStyle.cursorStyle,
    "identity.playerStyle.cursorStyle",
    et
  ), t.createdAt !== void 0 && !Number.isFinite(t.createdAt))
    throw new Error("identity.createdAt must be a finite number");
}
function Wo(t, e, n) {
  for (const s of Object.keys(t))
    if (!e.includes(s))
      throw new Error(`${n} must only include public presence fields`);
}
function cg(t) {
  try {
    return xl(t), !0;
  } catch {
    return !1;
  }
}
function ag(t) {
  xl(t);
}
function xl(t) {
  if (!z(t))
    throw new Error("cursor must be an object");
  if (!Number.isFinite(t.x))
    throw new Error("cursor.x must be a finite number");
  if (!Number.isFinite(t.y))
    throw new Error("cursor.y must be a finite number");
  if (typeof t.pointer != "string" || t.pointer.length === 0)
    throw new Error("cursor.pointer must be a non-empty string");
}
function lg(t) {
  if (!z(t))
    throw new Error("cursor zone must be an object");
  if (typeof t.zoneId != "string" || t.zoneId.length === 0)
    throw new Error("cursor zoneId must be a non-empty string");
  if (!Number.isFinite(t.relX))
    throw new Error("cursor zone relX must be a finite number");
  if (!Number.isFinite(t.relY))
    throw new Error("cursor zone relY must be a finite number");
}
function Yo(t) {
  if (typeof t != "string" || t.length === 0)
    throw new Error("Presence channel must be a non-empty string");
  ji(t, "Presence channel", 128);
}
function yr(t, e, n) {
  if (typeof t != "string" || t.length === 0)
    throw new Error(`${e} must be a non-empty string`);
  ji(t, e, n);
}
function ks(t, e, n) {
  if (t !== void 0) {
    if (typeof t != "string")
      throw new Error(`${e} must be a string`);
    ji(t, e, n);
  }
}
function ji(t, e, n) {
  if (t.length > n)
    throw new Error(`${e} must be ${n} characters or less`);
  if (/[\u0000-\u001f\u007f]/.test(t))
    throw new Error(`${e} must not contain control characters`);
}
function Dl(t) {
  try {
    if (JSON.stringify(t) === void 0)
      throw new Error("Presence value must be JSON-serializable");
  } catch {
    throw new Error("Presence value must be JSON-serializable");
  }
}
function z(t) {
  return t !== null && typeof t == "object" && !Array.isArray(t);
}
function mr(t) {
  return t !== null && typeof t == "object" && Object.getPrototypeOf(t) === Object.prototype;
}
function xs(t, e) {
  if (e != null) {
    if (Array.isArray(e)) {
      t.splice(0, t.length, ...e);
      return;
    }
    if (mr(e)) {
      for (const n of Object.keys(t))
        n in e || delete t[n];
      for (const [n, s] of Object.entries(e))
        Array.isArray(s) ? (Array.isArray(t[n]) || (t[n] = []), xs(t[n], s)) : mr(s) ? (mr(t[n]) || (t[n] = {}), xs(t[n], s)) : t[n] = s;
      return;
    }
    t = e;
  }
}
function We(t) {
  try {
    if (typeof structuredClone == "function")
      return structuredClone(t);
  } catch {
  }
  return t == null ? t : typeof t == "object" ? JSON.parse(JSON.stringify(t)) : t;
}
function Tl(t) {
  const [e, n] = t.split("#");
  if (!e || !n)
    throw new Error("Invalid data-source attribute value");
  const s = e.indexOf("/"), r = s === -1 ? e : e.slice(0, s), i = s === -1 ? "/" : e.slice(s);
  return { domain: r, path: i, elementId: n };
}
const ug = "LOCAL";
function hg(t) {
  return t ? t.replace(/^www\./i, "") : ug;
}
function Go(t) {
  if (!t) return "/";
  const e = t.replace(/\.[^/.]+$/, "");
  return e.startsWith("/") ? e : `/${e}`;
}
function Ds(t) {
  return Math.round(t * 10) / 10 + 0;
}
function Qt(t) {
  const e = t?.trim();
  if (!e) return null;
  const n = e.startsWith("#") ? e.slice(1) : e;
  return document.getElementById(n) ?? document.querySelector(e);
}
function qo(t) {
  return Qt(t.getAttribute(mg));
}
const Jo = 1, Xo = 60;
function dg(t) {
  const e = t.getAttribute(wg);
  if (e == null) return Jo;
  const n = parseFloat(e);
  return Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : Jo;
}
function fg(t) {
  const e = t.getAttribute(bg);
  if (e == null) return Xo;
  const n = parseFloat(e);
  return !Number.isFinite(n) || n < 0 ? Xo : n;
}
function Zo(t, e, n) {
  return Math.min(t, Math.max(t * e, n));
}
function Br(t, e, n) {
  const s = t.getBoundingClientRect(), r = e.getBoundingClientRect();
  return {
    x: s.left - r.left - e.clientLeft - n.x,
    y: s.top - r.top - e.clientTop - n.y
  };
}
function pg(t, e, n, s, r = Br(t, e, n)) {
  const i = dg(t), o = fg(t), c = t.offsetWidth, a = t.offsetHeight, l = Zo(c, i, o), u = Zo(a, i, o), h = l - c - r.x, d = e.clientWidth - l - r.x, f = u - a - r.y, p = e.clientHeight - u - r.y;
  return {
    x: d < h ? 0 : Math.min(d, Math.max(h, s.x)),
    y: p < f ? 0 : Math.min(p, Math.max(f, s.y))
  };
}
function gg(t) {
  return {
    x: Ds(t.x),
    y: Ds(t.y)
  };
}
const yg = "can-duplicate-to", mg = "can-move-bounds", wg = "can-move-bounds-min-visible", bg = "can-move-bounds-min-visible-px";
var Z = /* @__PURE__ */ ((t) => (t.CanPlay = "can-play", t.CanMove = "can-move", t.CanSpin = "can-spin", t.CanGrow = "can-grow", t.CanToggle = "can-toggle", t.CanDuplicate = "can-duplicate", t.CanHover = "can-hover", t.CanMirror = "can-mirror", t))(Z || {});
function Fn(t) {
  return t.getAttribute("data-source") ? vg(t) : t.id;
}
function vg(t) {
  const e = t.getAttribute("data-source");
  if (!e)
    throw new Error("Element has no data-source attribute");
  const [n, s] = e.split("#");
  if (!n || !s)
    throw new Error("Invalid data-source attribute");
  return s;
}
const Ll = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='44' height='53' viewport='0 0 100 100' style='fill:black;font-size:26px;'><text y='40%'>🚿</text></svg>")
      16 0,
    auto`, Cg = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>✂️</text></svg>") 16 0,auto`;
function Qo(t, { getData: e, getElement: n, getLocalData: s, setLocalData: r }) {
  const i = e(), o = s(), c = n();
  if (o.isHovering = !0, t.altKey) {
    if (i.scale <= 0.5) {
      c.style.cursor = "not-allowed";
      return;
    }
    c.style.cursor = Cg;
  } else {
    if (i.scale >= i.maxScale) {
      c.style.cursor = "not-allowed";
      return;
    }
    c.style.cursor = Ll;
  }
  r(o);
}
function Jn(t) {
  if ("touches" in t) {
    const { clientX: e, clientY: n } = t.touches[0];
    return { clientX: e, clientY: n };
  }
  return { clientX: t.clientX, clientY: t.clientY };
}
const Il = {
  "can-move": {
    defaultData: { x: 0, y: 0 },
    defaultLocalData: { startMouseX: 0, startMouseY: 0 },
    updateElement: ({ element: t, data: e }) => {
      t.style.transform = `translate(${e.x}px, ${e.y}px)`;
    },
    onDragStart: (t, { data: e, element: n, setLocalData: s }) => {
      const { clientX: r, clientY: i } = Jn(t), o = qo(n), c = o ? Br(n, o, e) : void 0;
      s({
        startMouseX: r,
        startMouseY: i,
        dragX: e.x,
        dragY: e.y,
        boundsBaseX: c?.x,
        boundsBaseY: c?.y
      });
    },
    onDrag: (t, { data: e, localData: n, setData: s, setLocalData: r, element: i }) => {
      const { clientX: o, clientY: c } = Jn(t), a = e.x + o - n.startMouseX, l = e.y + c - n.startMouseY, u = qo(i);
      if (u) {
        const w = {
          x: n.dragX ?? e.x,
          y: n.dragY ?? e.y
        }, C = w.x + o - n.startMouseX, v = w.y + c - n.startMouseY, E = n.boundsBaseX !== void 0 && n.boundsBaseY !== void 0 ? { x: n.boundsBaseX, y: n.boundsBaseY } : Br(i, u, w), x = pg(
          i,
          u,
          w,
          {
            x: C,
            y: v
          },
          E
        ), y = gg(x);
        s(y);
        const _ = x.x - w.x, V = x.y - w.y;
        r({
          startMouseX: n.startMouseX + _,
          startMouseY: n.startMouseY + V,
          dragX: y.x,
          dragY: y.y,
          boundsBaseX: E.x,
          boundsBaseY: E.y
        });
        return;
      }
      const { top: h, left: d, bottom: f, right: p } = i.getBoundingClientRect(), g = window.visualViewport?.width ?? window.innerWidth, m = window.visualViewport?.height ?? window.innerHeight;
      p > g && o > n.startMouseX || f > m && c > n.startMouseY || d < 0 && o < n.startMouseX || h < 0 && c < n.startMouseY || (s({
        x: Ds(a),
        y: Ds(l)
      }), r({ startMouseX: o, startMouseY: c }));
    },
    resetShortcut: "shiftKey"
  },
  "can-spin": {
    defaultData: { rotation: 0 },
    defaultLocalData: { startMouseX: 0 },
    updateElement: ({ element: t, data: e }) => {
      t.style.transform = `rotate(${e.rotation}deg)`;
    },
    onDragStart: (t, { setLocalData: e }) => {
      const { clientX: n } = Jn(t);
      e({
        startMouseX: n
      });
    },
    onDrag: (t, { data: e, localData: n, setData: s, setLocalData: r }) => {
      const { clientX: i } = Jn(t);
      let o = Math.abs(i - n.startMouseX) * 2, c = e.rotation;
      i > n.startMouseX ? c += o : i < n.startMouseX && (c -= o), s({ rotation: c }), r({ startMouseX: i });
    },
    resetShortcut: "shiftKey"
  },
  "can-toggle": {
    defaultData: { on: !1 },
    updateElement: ({ element: t, data: e }) => {
      const n = typeof e == "object" ? e.on : e;
      t.classList.toggle("toggled", n), t.classList.toggle("clicked", n);
    },
    onClick: (t, { data: e, setData: n }) => {
      const s = typeof e == "object" ? e.on : e;
      n({ on: !s });
    },
    resetShortcut: "shiftKey"
  },
  "can-grow": {
    defaultData: { scale: 1 },
    defaultLocalData: { maxScale: 2, isHovering: !1 },
    updateElement: ({ element: t, data: e }) => {
      t.style.transform = `scale(${e.scale})`;
    },
    onClick: (t, { data: e, element: n, setData: s, localData: r }) => {
      let { scale: i } = e;
      if (t.altKey) {
        if (e.scale <= 0.5)
          return;
        i -= 0.1;
      } else {
        if (n.style.cursor = Ll, e.scale >= r.maxScale)
          return;
        i += 0.1;
      }
      s({ ...e, scale: i });
    },
    onMount: (t) => {
      const e = t.getElement();
      let n = !1;
      const s = (o) => Qo(o, t), r = (o) => {
        Qo(o, t), !n && (n = !0, document.addEventListener("keydown", s), document.addEventListener("keyup", s));
      }, i = () => {
        n && (n = !1, document.removeEventListener("keydown", s), document.removeEventListener("keyup", s));
      };
      e.addEventListener("mouseenter", r), e.addEventListener("mouseleave", i);
    },
    resetShortcut: "shiftKey"
  },
  // TODO: add ability to add max # of duplicates
  // TODO: add lifespan to automatically prune
  // TODO: add limit per person / per timeframe.
  "can-duplicate": {
    defaultData: [],
    defaultLocalData: [],
    updateElement: ({ data: t, localData: e, setLocalData: n, element: s }) => {
      const r = s.getAttribute(
        "can-duplicate"
        /* CanDuplicate */
      ), i = Qt(r);
      let o = document.getElementById(e.slice(-1)?.[0]) ?? null;
      if (!i) {
        console.error(
          `Element ${r} not found. Cannot duplicate.`
        );
        return;
      }
      const c = Qt(
        s.getAttribute(yg)
      );
      function a(u) {
        if (c) {
          c.appendChild(u);
          return;
        }
        i.parentNode.insertBefore(
          u,
          (o || i).nextSibling
        );
      }
      const l = new Set(e);
      for (const u of t) {
        if (l.has(u)) continue;
        const h = i.cloneNode(!0);
        Object.assign(h, { ...i }), h.id = u, a(h), e.push(u), window.playhtml.setupPlayElement(h), o = h;
      }
      n(e);
    },
    onClick: (t, { data: e, element: n, setData: s }) => {
      const r = Qt(
        n.getAttribute(
          "can-duplicate"
          /* CanDuplicate */
        )
      );
      if (!r) return;
      const i = r.id + "-" + Math.random().toString(36).substr(2, 9);
      s((o) => {
        o.push(i);
      });
    },
    isValidElementForTag: (t) => {
      const e = t.getAttribute(
        "can-duplicate"
        /* CanDuplicate */
      );
      return e ? (Qt(e) || console.warn(
        `can-duplicate element (${t.id}) duplicate element ("${e}") not found.`
      ), !0) : !1;
    }
  },
  // TODO: auto-duplicate :hover CSS rules to [data-playhtml-hover] via CSSOM
  // so users don't need to manually rewrite their hover styles.
  "can-hover": {
    defaultData: {},
    myDefaultAwareness: { hover: !1 },
    onMount: ({ getElement: t, setMyAwareness: e }) => {
      const n = t();
      n.addEventListener("mouseenter", () => {
        e({ hover: !0 }), n.setAttribute("data-playhtml-hover", "");
      }), n.addEventListener("mouseleave", () => {
        e({ hover: !1 }), n.removeAttribute("data-playhtml-hover");
      });
    },
    updateElement: () => {
    },
    updateElementAwareness: ({ element: t, awareness: e }) => {
      e.some((n) => n?.hover) ? t.setAttribute("data-playhtml-hover", "") : t.removeAttribute("data-playhtml-hover");
    }
  },
  "can-mirror": Op
};
function Sg() {
  const t = [];
  if (document.querySelectorAll("[shared]").forEach((e) => {
    const n = e, s = n.id;
    if (!s) return;
    const r = `${window.location.host}${Go(
      window.location.pathname
    )}#${s}`;
    t.push({
      type: "source",
      elementId: s,
      dataSource: r,
      normalized: r,
      permissions: n.getAttribute("shared")?.includes("read-only") ? "read-only" : "read-write",
      element: n
    });
  }), document.querySelectorAll("[data-source]").forEach((e) => {
    const n = e, s = n.getAttribute("data-source") || "", [r, i] = s.split("#");
    if (!r || !i) return;
    const o = r.indexOf("/"), c = o === -1 ? r : r.slice(0, o), a = o === -1 ? "/" : r.slice(o), l = `${c}${Go(a)}#${i}`;
    t.push({
      type: "consumer",
      elementId: i,
      dataSource: s,
      normalized: l,
      element: n
    });
  }), t.length > 0)
    try {
      console.table(
        t.map((e) => ({
          type: e.type,
          elementId: e.elementId,
          dataSource: e.dataSource,
          normalized: e.normalized,
          permissions: e.permissions || ""
        }))
      );
    } catch {
    }
  return t;
}
function Eg(t) {
  let e = !1, n = !1, s = !1;
  async function r() {
    if (!s) {
      if (e) {
        n = !0;
        return;
      }
      e = !0;
      try {
        await t();
      } finally {
        e = !1, n && !s && (n = !1, await r());
      }
    }
  }
  return {
    trigger: r,
    destroy() {
      s = !0, n = !1;
    }
  };
}
function _g(t) {
  const e = () => {
    t.trigger();
  }, n = () => {
    t.trigger();
  };
  window.addEventListener("popstate", e);
  const s = window.navigation;
  return s && typeof s.addEventListener == "function" && s.addEventListener("navigate", n), () => {
    window.removeEventListener("popstate", e), s && typeof s.removeEventListener == "function" && s.removeEventListener("navigate", n);
  };
}
function Ml(t) {
  document.dispatchEvent(
    new CustomEvent("playhtml:navigated", { detail: { room: t } })
  );
}
function bn() {
  return bn = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var n = arguments[e];
      for (var s in n)
        Object.prototype.hasOwnProperty.call(n, s) && (t[s] = n[s]);
    }
    return t;
  }, bn.apply(this, arguments);
}
function Ag(t, e) {
  t.prototype = Object.create(e.prototype), t.prototype.constructor = t, Vr(t, e);
}
function Vr(t, e) {
  return Vr = Object.setPrototypeOf || function(s, r) {
    return s.__proto__ = r, s;
  }, Vr(t, e);
}
function kg(t) {
  if (t === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return t;
}
var $l = /* @__PURE__ */ (function() {
  function t(n) {
    this.trigger = n, this.observing = /* @__PURE__ */ new Map();
  }
  var e = t.prototype;
  return e.registerConnection = function(s) {
    var r = this.observing.get(s.observable);
    r || (r = {
      byKey: /* @__PURE__ */ new Set(),
      iterate: !1
    }, this.observing.set(s.observable, r)), s.type === "iterate" ? r.iterate = !0 : r.byKey.add(s.key);
  }, e.removeObservers = function() {
    var s = this;
    this.observing.forEach(function(r, i) {
      r.iterate && i[R].connections.iterate.delete(s), r.byKey.forEach(function(o) {
        i[R].connections.byKey.get(o).delete(s);
      });
    }), this.observing.clear();
  }, t;
})(), at = [], Ws = /* @__PURE__ */ (function(t) {
  Ag(e, t);
  function e(s, r, i) {
    var o;
    if (o = t.call(this, function() {
      return o._trigger();
    }) || this, o.func = s, o.options = r, o.effect = i, o.isInitial = !0, o.reaction = function() {
      at.push(kg(o));
      try {
        o.func();
      } finally {
        at.pop();
      }
      o.effect && (!o.isInitial || o.options.fireImmediately) && o.effect(), o.isInitial = !1;
    }, !i && !o.options.fireImmediately)
      throw new Error("if no effect function passed, should always fireImmediately");
    return o.reaction(), o;
  }
  var n = e.prototype;
  return n._trigger = function() {
    if (at.includes(this))
      throw new Error("already running reaction");
    this.removeObservers(), this.reaction();
  }, e;
})($l);
function Ol() {
  return !!at.length;
}
function Pl() {
  return at.length ? at[at.length - 1] : void 0;
}
function xg(t, e, n) {
  var s = bn({
    name: "unnamed",
    fireImmediately: !0
  }, n), r = new Ws(t, s, e);
  return r;
}
var hs = 0;
function Rl() {
  return hs > 0;
}
function Kr(t) {
  hs++;
  try {
    return t();
  } finally {
    hs--, hs === 0 && Tg();
  }
}
var Wr = !1;
function Nl() {
  return Wr;
}
function Ul(t) {
  Wr = !0;
  try {
    t();
  } finally {
    Wr = !1;
  }
}
function Dg(t) {
  return function() {
    return Ul(t);
  };
}
var Yr = [];
function Tg() {
  var t = [].concat(Yr);
  Yr = [], Fl(t);
}
function Fl(t) {
  var e = /* @__PURE__ */ new Set();
  t.forEach(function(n) {
    var s;
    (n.type === "add" || n.type === "delete") && n.observable[R].connections.iterate.forEach(function(r) {
      e.add(r);
    }), (s = n.observable[R].connections.byKey.get(n.key)) == null || s.forEach(function(r) {
      e.add(r);
    });
  }), e.forEach(function(n) {
    n.trigger();
  });
}
function Xn(t) {
  if (Rl()) {
    Yr.push(t);
    return;
  }
  Fl([t]);
}
function ec(t, e) {
  if (t.type === "iterate")
    t.observable[R].connections.iterate.add(e);
  else {
    var n = t.observable[R].connections.byKey.get(t.key);
    n || (n = /* @__PURE__ */ new Set(), t.observable[R].connections.byKey.set(t.key, n)), n.add(e);
  }
}
function Zn(t, e) {
  if (!Nl()) {
    var n = Pl();
    n && (ec(t, n), n.registerConnection(t)), e && (ec(t, e), e.registerConnection(t));
  }
}
var Hi = /* @__PURE__ */ Symbol("$skipreactive"), R = /* @__PURE__ */ Symbol("$reactive"), ae = /* @__PURE__ */ Symbol("$reactiveproxy");
function jn(t, e) {
  return !!(t && t[ae] && t[ae].implicitObserver === e);
}
function zi(t) {
  return t[Hi] = !0, t;
}
function jl(t) {
  return !!(t && !jn(t) && t[R]);
}
function Gr(t, e, n) {
  if (n === void 0 && (n = !1), t[Hi] || jn(t, e))
    return t;
  var s = Lg(t, n);
  if (!e)
    return s;
  var r = s[R].proxiesWithImplicitObserver.get(e);
  if (!r) {
    var i = {
      implicitObserver: e
    };
    Object.setPrototypeOf(i, Hl), r = new Proxy(s[R].raw, i), s[R].proxiesWithImplicitObserver.set(e, r);
  }
  return r;
}
var vn = Gr;
function Lg(t, e) {
  if (e === void 0 && (e = !1), jn(t))
    return t;
  if (jl(t))
    return t[R].proxy;
  if (t[R] || t[ae])
    throw new Error("unexpected");
  var n = {
    connections: {
      iterate: /* @__PURE__ */ new Set(),
      byKey: /* @__PURE__ */ new Map()
    },
    proxy: {},
    raw: t,
    proxiesWithImplicitObserver: /* @__PURE__ */ new Map(),
    shallow: e
  };
  Object.defineProperty(t, R, {
    enumerable: !1,
    writable: !0,
    configurable: !0,
    value: n
  });
  var s = new Proxy(t, Hl);
  return n.proxy = s, s;
}
var Hl = {
  // Read:
  has: function(e, n) {
    var s = Reflect.has(e, n);
    return typeof n == "symbol" || Zn({
      observable: e,
      key: n,
      type: "has"
    }, this.implicitObserver), s;
  },
  get: function(e, n, s) {
    if (n === ae)
      return {
        implicitObserver: this.implicitObserver
      };
    var r = Reflect.get(e, n, s);
    if (typeof n == "symbol")
      return n.toString() === "Symbol($reactiveproxy)" && console.error("warning, Symbol($reactiveproxy) passed, but does not match $reactiveproxy. Multiple Reactive libraries loaded?"), r;
    if (n === "length" && Array.isArray(e) ? Zn({
      observable: e,
      type: "iterate"
    }, this.implicitObserver) : Zn({
      observable: e,
      key: n,
      type: "get"
    }, this.implicitObserver), jl(r))
      return Gr(r, this.implicitObserver);
    if (e[R].shallow)
      return r;
    if (typeof r == "object" && r !== null && !jn(r, this.implicitObserver) && !Object.isFrozen(r)) {
      var i = Reflect.getOwnPropertyDescriptor(e, n);
      if ((!i || !(i.writable === !1 && i.configurable === !1)) && (Ol() || this.implicitObserver))
        return Gr(r, this.implicitObserver);
    }
    return r;
  },
  ownKeys: function(e) {
    return Zn({
      observable: e,
      type: "iterate"
    }, this.implicitObserver), Reflect.ownKeys(e);
  },
  // Write:
  set: function(e, n, s, r) {
    return Kr(function() {
      if (typeof n == "symbol")
        return Reflect.set(e, n, s, r);
      var i = Object.hasOwnProperty.call(e, n), o = Reflect.get(e, n, r), c = Reflect.set(e, n, s, r);
      if (!i)
        Xn({
          observable: e,
          key: n,
          value: s,
          type: "add"
        });
      else if (s !== o)
        if (n === "length" && Array.isArray(e)) {
          if (!(o < s))
            for (var a = s + 1; a <= o; a++)
              Xn({
                observable: e,
                key: "" + (a - 1),
                oldValue: void 0,
                type: "delete"
              });
        } else
          Xn({
            observable: e,
            key: n,
            value: s,
            oldValue: o,
            type: "update"
          });
      return c;
    });
  },
  deleteProperty: function(e, n) {
    return Kr(function() {
      if (typeof n == "symbol")
        return Reflect.deleteProperty(e, n);
      var s = Object.hasOwnProperty.call(e, n), r = Reflect.get(e, n), i = Reflect.deleteProperty(e, n);
      return s && Xn({
        observable: e,
        key: n,
        oldValue: r,
        type: "delete"
      }), i;
    });
  },
  preventExtensions: function(e) {
    throw new Error("Dynamic observable objects cannot be frozen");
  }
};
function Ig(t, e) {
  var n = bn({
    name: "unnamed",
    fireImmediately: !0
  }, e), s = new Ws(t, n);
  return s;
}
function Mg(t, e, n) {
  var s = bn({
    name: "unnamed",
    fireImmediately: !0
  }, n), r = new Ws(function() {
    t(e);
  }, s);
  return e = vn(e, r), s.fireImmediately && r.trigger(), r;
}
var zl = /* @__PURE__ */ (function() {
  function t() {
    this._observable = vn({
      _key: 1
    });
  }
  var e = t.prototype;
  return e.reportObserved = function(s) {
    return vn(this._observable, s)._key;
  }, e.reportChanged = function() {
    this._observable._key++;
  }, t;
})();
function $g(t, e, n) {
  return new zl();
}
const Og = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  $reactive: R,
  $reactiveproxy: ae,
  $skipreactive: Hi,
  Atom: zl,
  Observer: $l,
  Reaction: Ws,
  autorun: Ig,
  autorunAsync: Mg,
  createAtom: $g,
  hasRunningReaction: Ol,
  isActionRunning: Rl,
  isReactive: jn,
  isTrackingDisabled: Nl,
  markRaw: zi,
  reaction: xg,
  reactive: vn,
  runInAction: Kr,
  runningReaction: Pl,
  untracked: Ul,
  untrackedCB: Dg
}, Symbol.toStringTag, { value: "Module" }));
let qr, Jr, Pg = (t) => t();
function Rg(t, e) {
  if (Jr)
    return Jr(t, e);
  Pg(t);
}
function pt(t, e, n) {
  if (qr)
    return qr.apply(null, arguments);
  throw new Error("observable implementation not provided. Call enableReactiveBindings, enableVueBindings or enableMobxBindings.");
}
function Ng(t) {
  qr = function(e, n, s) {
    const r = t.createAtom(e);
    return n && n(), r;
  }, Jr = (e, n) => t.reaction(e, n, {
    fireImmediately: !1
  });
}
const tc = /* @__PURE__ */ new WeakSet();
function Ug(t) {
  if (tc.has(t))
    return t;
  tc.add(t);
  let e;
  const n = /* @__PURE__ */ new Map();
  function s() {
    if (!e) {
      const h = (d) => {
        (d.changes.added.size || d.changes.deleted.size || d.changes.keys.size || d.changes.delta.length) && e.reportChanged();
      };
      e = pt("map", () => {
        t.observe(h);
      }, () => {
        t.unobserve(h);
      });
    }
    e.reportObserved(t._implicitObserver);
  }
  function r(h) {
    let d = n.get(h);
    if (!d) {
      const f = (p) => {
        d.reportChanged();
      };
      d = pt(h + "", () => {
        t.observe(f);
      }, () => {
        t.unobserve(f);
      }), n.set(h, d);
    }
    d.reportObserved(t._implicitObserver);
  }
  const i = t.get;
  t.get = function(h) {
    if (typeof h != "number")
      throw new Error("unexpected");
    return r(h), Reflect.apply(i, this, arguments);
  };
  function o(h) {
    const d = t[h];
    t[h] = function() {
      return s(), Reflect.apply(d, this, arguments);
    };
  }
  function c(h) {
    let d = t, f = Object.getOwnPropertyDescriptor(d, h);
    if (f || (d = Object.getPrototypeOf(d), f = Object.getOwnPropertyDescriptor(d, h)), f || (d = Object.getPrototypeOf(d), f = Object.getOwnPropertyDescriptor(d, h)), !f)
      throw new Error("property not found");
    const p = f.get;
    f.get = function() {
      return this._disableTracking || s(), Reflect.apply(p, this, arguments);
    }, Object.defineProperty(t, h, f);
  }
  function a(h, d) {
    let f = t, p = Object.getOwnPropertyDescriptor(f, h);
    if (p || (f = Object.getPrototypeOf(f), p = Object.getOwnPropertyDescriptor(f, h)), p || (f = Object.getPrototypeOf(f), p = Object.getOwnPropertyDescriptor(f, h)), !p)
      throw new Error("property not found");
    Object.defineProperty(t, d, p);
  }
  o("forEach"), o("toJSON"), o("toArray"), o("slice"), o("map"), a("length", "lengthUntracked"), c("length");
  const l = t.push;
  t.push = function(h) {
    this._disableTracking = !0;
    const d = l.call(this, h);
    return this._disableTracking = !1, d;
  };
  const u = t.slice;
  return t.slice = function(h, d) {
    this._disableTracking = !0;
    const f = u.call(this, h, d);
    return this._disableTracking = !1, f;
  }, t;
}
const nc = /* @__PURE__ */ new WeakSet();
function Fg(t) {
  if (nc.has(t))
    return t;
  nc.add(t);
  let e;
  function n() {
    if (!e) {
      let i = Array.from(t.share.keys());
      const o = (c) => {
        const a = Array.from(t.share.keys());
        JSON.stringify(i) !== JSON.stringify(a) && (i = a, e.reportChanged());
      };
      e = pt("map", () => {
        t.on("beforeObserverCalls", o);
      }, () => {
        t.off("beforeObserverCalls", o);
      });
    }
    e.reportObserved(t._implicitObserver);
  }
  const s = t.get;
  t.get = function(i) {
    if (typeof i != "string")
      throw new Error("unexpected");
    const o = Reflect.apply(s, this, arguments);
    return Ys(o), o;
  };
  function r(i) {
    const o = t[i];
    let c;
    t[i] = function() {
      let a, l = arguments;
      return n(), c && c.removeObservers(), c = Rg(() => (a = Reflect.apply(o, t, l), a), () => e.reportChanged()), a;
    };
  }
  return r("toJSON"), Object.defineProperty(t, "keys", {
    get: () => (n(), Object.keys(t.share))
  }), t;
}
const sc = /* @__PURE__ */ new WeakSet();
function jg(t) {
  if (sc.has(t))
    return t;
  sc.add(t);
  let e;
  const n = /* @__PURE__ */ new Map();
  function s() {
    if (!e) {
      const c = (a) => {
        (a.changes.added.size || a.changes.deleted.size || a.changes.keys.size || a.changes.delta.length) && e.reportChanged();
      };
      e = pt("map", () => {
        t.observe(c);
      }, () => {
        t.unobserve(c);
      });
    }
    e.reportObserved(t._implicitObserver);
  }
  function r(c) {
    let a = n.get(c);
    if (!a) {
      const l = (u) => {
        u.keysChanged.has(c) && (u.changes.added.size || u.changes.deleted.size || u.changes.keys.size || u.changes.delta.length) && a.reportChanged();
      };
      a = pt(c, () => {
        t.observe(l);
      }, () => {
        t.unobserve(l);
      }), n.set(c, a);
    }
    a.reportObserved(t._implicitObserver);
  }
  const i = t.get;
  t.get = function(c) {
    if (typeof c != "string")
      throw new Error("unexpected");
    return r(c), Reflect.apply(i, this, arguments);
  };
  function o(c) {
    const a = t[c];
    t[c] = function() {
      return s(), Reflect.apply(a, this, arguments);
    };
  }
  return o("values"), o("entries"), o("keys"), o("forEach"), o("toJSON"), t;
}
const rc = /* @__PURE__ */ new WeakSet();
function ic(t) {
  if (rc.has(t))
    return t;
  rc.add(t);
  let e;
  const n = (r) => {
    e.reportChanged();
  };
  e = pt("text", () => {
    t.observe(n);
  }, () => {
    t.unobserve(n);
  });
  function s(r) {
    const i = t[r];
    t[r] = function() {
      return e.reportObserved(this._implicitObserver), Reflect.apply(i, this, arguments);
    };
  }
  return s("toString"), s("toJSON"), t;
}
const oc = /* @__PURE__ */ new WeakSet();
function cc(t) {
  if (oc.has(t))
    return t;
  oc.add(t);
  let e;
  const n = (i) => {
    (i.changes.added.size || i.changes.deleted.size || i.changes.keys.size || i.changes.delta.length) && e.reportChanged();
  };
  e = pt("xml", () => {
    t.observe(n);
  }, () => {
    t.unobserve(n);
  });
  function s(i) {
    const o = t[i];
    t[i] = function() {
      return e.reportObserved(this._implicitObserver), Reflect.apply(o, this, arguments);
    };
  }
  function r(i) {
    let o = t, c = Object.getOwnPropertyDescriptor(o, i);
    if (c || (o = Object.getPrototypeOf(o), c = Object.getOwnPropertyDescriptor(o, i)), c || (o = Object.getPrototypeOf(o), c = Object.getOwnPropertyDescriptor(o, i)), !c)
      throw new Error("property not found");
    const a = c.get;
    c.get = function() {
      return e.reportObserved(this._implicitObserver), Reflect.apply(a, this, arguments);
    }, Object.defineProperty(t, i, c);
  }
  return s("toString"), s("toDOM"), s("toArray"), s("getAttribute"), r("firstChild"), t;
}
function Ys(t) {
  return t instanceof dt || t instanceof Ie ? ic(t) : t instanceof be ? Ug(t) : t instanceof Se ? jg(t) : t instanceof me || Object.prototype.hasOwnProperty.call(t, "autoLoad") ? Fg(t) : t instanceof Ee || t instanceof Me ? cc(t) : t;
}
function ac(t) {
  t.share.forEach((e) => {
    e.constructor !== L && Ys(e);
  });
}
function lc(t, e) {
  for (let s = t.length - 1; s >= e; s--) {
    let r = t[s];
    if (!r.deleted) {
      var n;
      if (r instanceof re)
        continue;
      (n = r.content) == null || n.getContent().forEach((i) => {
        i instanceof L && Ys(i);
      });
    }
  }
}
const uc = /* @__PURE__ */ new WeakSet();
function Hg(t) {
  uc.has(t) || (uc.add(t), Ys(t), t.store.clients.forEach((e) => {
    e && lc(e, 0);
  }), ac(t), t.on("beforeObserverCalls", (e) => {
    ac(t), e.afterState.forEach((n, s) => {
      const r = e.beforeState.get(s) || 0;
      if (r !== n) {
        const i = e.doc.store.clients.get(s);
        if (!i)
          return;
        const o = ge(i, r);
        lc(i, o);
      }
    });
  }));
}
class Cn {
  constructor(e) {
    this.value = void 0, this.value = e;
  }
}
function zg(t) {
  return ArrayBuffer.isView(t) ? new Cn(t) : new Cn(Object.freeze(t));
}
function Bg(t) {
  const e = function() {
    var c;
    let a = (c = this[ae]) == null ? void 0 : c.implicitObserver;
    return t._implicitObserver = a, t.slice.bind(t).apply(t, arguments).map((u) => {
      const h = Gs(u, a);
      return a && typeof h == "object" ? vn(h, a) : h;
    });
  }, n = function(c) {
    return c.map((a) => {
      const l = Bi(a);
      let u = ye(l) || l;
      if (u instanceof Cn && (u = u.value), u instanceof L && u.parent)
        throw new Error("Not supported: reassigning object that already occurs in the tree.");
      return u;
    });
  }, s = function() {
    return [].findIndex.apply(e.apply(this), arguments);
  }, r = {
    // get length() {
    //   return arr.length;
    // },
    // set length(val: number) {
    //   throw new Error("set length of yjs array is unsupported");
    // },
    slice: e,
    unshift: (...o) => (t.unshift(n(o)), t.lengthUntracked),
    push: (...o) => (t.push(n(o)), t.lengthUntracked),
    insert: t.insert.bind(t),
    toJSON: t.toJSON.bind(t),
    forEach: function() {
      return [].forEach.apply(e.apply(this), arguments);
    },
    every: function() {
      return [].every.apply(e.apply(this), arguments);
    },
    filter: function() {
      return [].filter.apply(e.apply(this), arguments);
    },
    find: function() {
      return [].find.apply(e.apply(this), arguments);
    },
    findIndex: s,
    some: function() {
      return [].some.apply(e.apply(this), arguments);
    },
    includes: function() {
      return [].includes.apply(e.apply(this), arguments);
    },
    map: function() {
      return [].map.apply(e.apply(this), arguments);
    },
    indexOf: function() {
      const o = arguments[0];
      return s.call(this, (c) => Yg(c, o));
    },
    splice: function() {
      let o = arguments[0] < 0 ? t.length - Math.abs(arguments[0]) : arguments[0], c = arguments[1], a = Array.from(Array.from(arguments).slice(2)), l = e.apply(this, [o, Number.isInteger(c) ? o + c : void 0]);
      return t.doc ? t.doc.transact(() => {
        t.delete(o, c), t.insert(o, n(a));
      }) : (t.delete(o, c), t.insert(o, n(a))), l;
    }
    // toJSON = () => {
    //   return this.arr.toJSON() slice();
    // };
    // delete = this.arr.delete.bind(this.arr) as (Y.Array<T>)["delete"];
  }, i = [];
  for (let o in r)
    i[o] = r[o];
  return i;
}
function Yt(t) {
  if (typeof t == "string" && t.trim().length) {
    const e = Number(t);
    if (Number.isInteger(e))
      return e;
  }
  return t;
}
function hc(t, e = new be()) {
  if (e[R])
    throw new Error("unexpected");
  const n = Bg(e), s = new Proxy(n, {
    set: (r, i, o) => {
      throw typeof Yt(i) != "number" ? new Error() : new Error("array assignment is not implemented / supported");
    },
    get: (r, i, o) => {
      const c = Yt(i);
      if (c === qs)
        return e;
      if (typeof c == "number") {
        let u;
        if (o && o[ae]) {
          var a;
          u = (a = o[ae]) == null ? void 0 : a.implicitObserver, e._implicitObserver = u;
        }
        let h = e.get(c);
        return h = Gs(h, u), h;
      }
      if (c === Symbol.toStringTag)
        return "Array";
      if (c === Symbol.iterator) {
        const u = e.slice();
        return Reflect.get(u, c);
      }
      return c === "length" ? e.length : Reflect.get(r, c, o);
    },
    // getOwnPropertyDescriptor: (target, pArg) => {
    //   const p = propertyToNumber(pArg);
    //   if (typeof p === "number" && p < arr.length && p >= 0) {
    //     return { configurable: true, enumerable: true, value: arr.get(p) };
    //   } else {
    //     return undefined;
    //   }
    // },
    deleteProperty: (r, i) => {
      const o = Yt(i);
      if (typeof o != "number")
        throw new Error();
      return o < e.lengthUntracked && o >= 0 ? (e.delete(o), !0) : !1;
    },
    has: (r, i) => {
      const o = Yt(i);
      return typeof o != "number" ? Reflect.has(r, o) : o < e.lengthUntracked && o >= 0;
    },
    getOwnPropertyDescriptor(r, i) {
      const o = Yt(i);
      if (o === "length")
        return {
          enumerable: !1,
          configurable: !1,
          writable: !0
        };
      if (typeof o == "number" && o >= 0 && o < e.lengthUntracked)
        return {
          enumerable: !0,
          configurable: !0,
          writable: !0
        };
    },
    ownKeys: (r) => {
      const i = [];
      for (let o = 0; o < e.length; o++)
        i.push(o + "");
      return i.push("length"), i;
    }
  });
  return n.push.apply(s, t), s;
}
function dc(t, e = new Se()) {
  if (e[R])
    throw new Error("unexpected");
  const n = new Proxy({}, {
    set: (s, r, i) => {
      if (typeof r != "string")
        throw new Error();
      const o = Bi(i);
      let c = ye(o) || o;
      if (c instanceof Cn && (c = c.value), c instanceof L && c.parent)
        throw new Error("Not supported: reassigning object that already occurs in the tree.");
      return e.set(r, c), !0;
    },
    get: (s, r, i) => {
      if (r === qs)
        return e;
      if (typeof r != "string")
        return Reflect.get(s, r);
      let o;
      if (i && i[ae]) {
        var c;
        o = (c = i[ae]) == null ? void 0 : c.implicitObserver, e._implicitObserver = o;
      }
      let a = e.get(r);
      return a = Gs(a, o), a;
    },
    deleteProperty: (s, r) => {
      if (typeof r != "string")
        throw new Error();
      return e.has(r) ? (e.delete(r), !0) : !1;
    },
    has: (s, r) => !!(typeof r == "string" && e.has(r)),
    getOwnPropertyDescriptor(s, r) {
      if (typeof r == "string" && e.has(r))
        return {
          enumerable: !0,
          configurable: !0
        };
    },
    ownKeys: (s) => Array.from(e.keys())
  });
  rn.set(e, n);
  for (let s in t)
    n[s] = t[s];
  return n;
}
function Vg(t) {
  return t instanceof L;
}
const rn = /* @__PURE__ */ new WeakMap();
function Gs(t, e) {
  if (Vg(t)) {
    if (t._implicitObserver = e, t instanceof be || t instanceof Se) {
      if (!rn.has(t)) {
        const n = Bi(t);
        rn.set(t, n);
      }
      t = rn.get(t);
    } else if (t instanceof Me || t instanceof Ee || t instanceof dt || t instanceof Nt || t instanceof Ie)
      zi(t), t.__v_skip = !0;
    else
      throw new Error("unknown YType");
    return t;
  } else {
    if (t === null)
      return null;
    if (typeof t == "object")
      return zg(t);
  }
  return t;
}
function Bi(t) {
  if (t == null)
    return t;
  if (t = ye(t) || t, t instanceof be)
    return hc([], t);
  if (t instanceof Se)
    return dc({}, t);
  if (typeof t == "string")
    return t;
  if (Array.isArray(t))
    return hc(t);
  if (t instanceof Me || t instanceof Ee || t instanceof dt || t instanceof Nt)
    return t;
  if (t instanceof Ie)
    return t;
  if (typeof t == "object")
    return t instanceof Cn ? t : dc(t);
  if (typeof t == "number" || typeof t == "boolean")
    return t;
  throw new Error("invalid");
}
function Kg(t) {
  for (let [e, n] of Object.entries(t))
    if (Array.isArray(n)) {
      if (n.length !== 0)
        throw new Error("Root Array initializer must always be empty array");
    } else if (n && typeof n == "object") {
      if (Object.keys(n).length !== 0 || Object.getPrototypeOf(n) !== Object.prototype)
        throw new Error("Root Object initializer must always be {}");
    } else if (n !== "xml" && n !== "text")
      throw new Error("unknown Root initializer");
}
function fc(t, e, n) {
  let s = e[n];
  if (!s) {
    n !== "__v_raw" && n !== "__v_isRef" && n !== "__v_isReadonly" && console.warn("property not found on root doc", n);
    return;
  }
  return s === "xml" ? t.getXmlFragment(n) : s === "text" ? t.getText(n) : Array.isArray(s) ? t.getArray(n) : t.getMap(n);
}
function Wg(t, e) {
  if (t[R])
    throw new Error("unexpected");
  Kg(e);
  const n = new Proxy({}, {
    set: (s, r, i) => {
      throw typeof r != "string" ? new Error() : new Error("cannot set new elements on root doc");
    },
    get: (s, r, i) => {
      if (r === qs)
        return t;
      if (typeof r != "string")
        return Reflect.get(s, r);
      let o;
      if (i && i[ae]) {
        var c;
        o = (c = i[ae]) == null ? void 0 : c.implicitObserver, t._implicitObserver = o;
      }
      if (r === "toJSON") {
        for (let u of Object.keys(e))
          fc(t, e, u);
        return Reflect.get(t, r);
      }
      let a = fc(t, e, r);
      return a = Gs(a, o), a;
    },
    deleteProperty: (s, r) => {
      throw new Error("deleteProperty not available for doc");
    },
    has: (s, r) => !!(typeof r == "string" && t.share.has(r)),
    getOwnPropertyDescriptor(s, r) {
      if (typeof r == "string" && t.share.has(r) || r === "toJSON")
        return {
          enumerable: !0,
          configurable: !0
        };
    },
    ownKeys: (s) => Array.from(t.share.keys())
  });
  return rn.set(t, n), n;
}
Ng(Og);
const qs = /* @__PURE__ */ Symbol("INTERNAL_SYMBOL");
function Bl(t) {
  const e = ye(t);
  if (!(e instanceof me))
    throw new Error("store is not a valid syncedStore that maps to a Y.Doc");
  return e;
}
function ye(t) {
  if (typeof t != "object" || t === null)
    return;
  const e = t[qs];
  return e && (zi(e), e.__v_skip = !0), e;
}
function Yg(t, e) {
  if (t === e)
    return !0;
  if (typeof t == "object" && typeof e == "object") {
    const n = ye(t), s = ye(e);
    return !n || !s ? !1 : n === s;
  }
  return !1;
}
function Vl(t, e = new me()) {
  return Hg(e), Wg(e, t);
}
const Vi = globalThis, pc = (t) => t, Ts = Vi.trustedTypes, gc = Ts ? Ts.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Kl = "$lit$", Ue = `lit$${Math.random().toFixed(9).slice(2)}$`, Wl = "?" + Ue, Gg = `<${Wl}>`, gt = document, Sn = () => gt.createComment(""), En = (t) => t === null || typeof t != "object" && typeof t != "function", Ki = Array.isArray, qg = (t) => Ki(t) || typeof t?.[Symbol.iterator] == "function", wr = `[ 	
\f\r]`, Gt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, yc = /-->/g, mc = />/g, Je = RegExp(`>|${wr}(?:([^\\s"'>=/]+)(${wr}*=${wr}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), wc = /'/g, bc = /"/g, Yl = /^(?:script|style|textarea|title)$/i, Gl = (t) => (e, ...n) => ({ _$litType$: t, strings: e, values: n }), f0 = Gl(1), p0 = Gl(2), Ye = /* @__PURE__ */ Symbol.for("lit-noChange"), F = /* @__PURE__ */ Symbol.for("lit-nothing"), vc = /* @__PURE__ */ new WeakMap(), nt = gt.createTreeWalker(gt, 129);
function ql(t, e) {
  if (!Ki(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return gc !== void 0 ? gc.createHTML(e) : e;
}
const Jg = (t, e) => {
  const n = t.length - 1, s = [];
  let r, i = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = Gt;
  for (let c = 0; c < n; c++) {
    const a = t[c];
    let l, u, h = -1, d = 0;
    for (; d < a.length && (o.lastIndex = d, u = o.exec(a), u !== null); ) d = o.lastIndex, o === Gt ? u[1] === "!--" ? o = yc : u[1] !== void 0 ? o = mc : u[2] !== void 0 ? (Yl.test(u[2]) && (r = RegExp("</" + u[2], "g")), o = Je) : u[3] !== void 0 && (o = Je) : o === Je ? u[0] === ">" ? (o = r ?? Gt, h = -1) : u[1] === void 0 ? h = -2 : (h = o.lastIndex - u[2].length, l = u[1], o = u[3] === void 0 ? Je : u[3] === '"' ? bc : wc) : o === bc || o === wc ? o = Je : o === yc || o === mc ? o = Gt : (o = Je, r = void 0);
    const f = o === Je && t[c + 1].startsWith("/>") ? " " : "";
    i += o === Gt ? a + Gg : h >= 0 ? (s.push(l), a.slice(0, h) + Kl + a.slice(h) + Ue + f) : a + Ue + (h === -2 ? c : f);
  }
  return [ql(t, i + (t[n] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class _n {
  constructor({ strings: e, _$litType$: n }, s) {
    let r;
    this.parts = [];
    let i = 0, o = 0;
    const c = e.length - 1, a = this.parts, [l, u] = Jg(e, n);
    if (this.el = _n.createElement(l, s), nt.currentNode = this.el.content, n === 2 || n === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = nt.nextNode()) !== null && a.length < c; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(Kl)) {
          const d = u[o++], f = r.getAttribute(h).split(Ue), p = /([.?@])?(.*)/.exec(d);
          a.push({ type: 1, index: i, name: p[2], strings: f, ctor: p[1] === "." ? Zg : p[1] === "?" ? Qg : p[1] === "@" ? ey : Js }), r.removeAttribute(h);
        } else h.startsWith(Ue) && (a.push({ type: 6, index: i }), r.removeAttribute(h));
        if (Yl.test(r.tagName)) {
          const h = r.textContent.split(Ue), d = h.length - 1;
          if (d > 0) {
            r.textContent = Ts ? Ts.emptyScript : "";
            for (let f = 0; f < d; f++) r.append(h[f], Sn()), nt.nextNode(), a.push({ type: 2, index: ++i });
            r.append(h[d], Sn());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Wl) a.push({ type: 2, index: i });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(Ue, h + 1)) !== -1; ) a.push({ type: 7, index: i }), h += Ue.length - 1;
      }
      i++;
    }
  }
  static createElement(e, n) {
    const s = gt.createElement("template");
    return s.innerHTML = e, s;
  }
}
function Ut(t, e, n = t, s) {
  if (e === Ye) return e;
  let r = s !== void 0 ? n._$Co?.[s] : n._$Cl;
  const i = En(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== i && (r?._$AO?.(!1), i === void 0 ? r = void 0 : (r = new i(t), r._$AT(t, n, s)), s !== void 0 ? (n._$Co ??= [])[s] = r : n._$Cl = r), r !== void 0 && (e = Ut(t, r._$AS(t, e.values), r, s)), e;
}
class Xg {
  constructor(e, n) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = n;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: n }, parts: s } = this._$AD, r = (e?.creationScope ?? gt).importNode(n, !0);
    nt.currentNode = r;
    let i = nt.nextNode(), o = 0, c = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let l;
        a.type === 2 ? l = new Vt(i, i.nextSibling, this, e) : a.type === 1 ? l = new a.ctor(i, a.name, a.strings, this, e) : a.type === 6 && (l = new ty(i, this, e)), this._$AV.push(l), a = s[++c];
      }
      o !== a?.index && (i = nt.nextNode(), o++);
    }
    return nt.currentNode = gt, r;
  }
  p(e) {
    let n = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, n), n += s.strings.length - 2) : s._$AI(e[n])), n++;
  }
}
class Vt {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, n, s, r) {
    this.type = 2, this._$AH = F, this._$AN = void 0, this._$AA = e, this._$AB = n, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const n = this._$AM;
    return n !== void 0 && e?.nodeType === 11 && (e = n.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, n = this) {
    e = Ut(this, e, n), En(e) ? e === F || e == null || e === "" ? (this._$AH !== F && this._$AR(), this._$AH = F) : e !== this._$AH && e !== Ye && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : qg(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== F && En(this._$AH) ? this._$AA.nextSibling.data = e : this.T(gt.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: n, _$litType$: s } = e, r = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = _n.createElement(ql(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(n);
    else {
      const i = new Xg(r, this), o = i.u(this.options);
      i.p(n), this.T(o), this._$AH = i;
    }
  }
  _$AC(e) {
    let n = vc.get(e.strings);
    return n === void 0 && vc.set(e.strings, n = new _n(e)), n;
  }
  k(e) {
    Ki(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let s, r = 0;
    for (const i of e) r === n.length ? n.push(s = new Vt(this.O(Sn()), this.O(Sn()), this, this.options)) : s = n[r], s._$AI(i), r++;
    r < n.length && (this._$AR(s && s._$AB.nextSibling, r), n.length = r);
  }
  _$AR(e = this._$AA.nextSibling, n) {
    for (this._$AP?.(!1, !0, n); e !== this._$AB; ) {
      const s = pc(e).nextSibling;
      pc(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class Js {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, n, s, r, i) {
    this.type = 1, this._$AH = F, this._$AN = void 0, this.element = e, this.name = n, this._$AM = r, this.options = i, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = F;
  }
  _$AI(e, n = this, s, r) {
    const i = this.strings;
    let o = !1;
    if (i === void 0) e = Ut(this, e, n, 0), o = !En(e) || e !== this._$AH && e !== Ye, o && (this._$AH = e);
    else {
      const c = e;
      let a, l;
      for (e = i[0], a = 0; a < i.length - 1; a++) l = Ut(this, c[s + a], n, a), l === Ye && (l = this._$AH[a]), o ||= !En(l) || l !== this._$AH[a], l === F ? e = F : e !== F && (e += (l ?? "") + i[a + 1]), this._$AH[a] = l;
    }
    o && !r && this.j(e);
  }
  j(e) {
    e === F ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Zg extends Js {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === F ? void 0 : e;
  }
}
class Qg extends Js {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== F);
  }
}
class ey extends Js {
  constructor(e, n, s, r, i) {
    super(e, n, s, r, i), this.type = 5;
  }
  _$AI(e, n = this) {
    if ((e = Ut(this, e, n, 0) ?? F) === Ye) return;
    const s = this._$AH, r = e === F && s !== F || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, i = e !== F && (s === F || r);
    r && this.element.removeEventListener(this.name, this, s), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class ty {
  constructor(e, n, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Ut(this, e);
  }
}
const ny = { I: Vt }, sy = Vi.litHtmlPolyfillSupport;
sy?.(_n, Vt), (Vi.litHtmlVersions ??= []).push("3.3.3");
const ry = (t, e, n) => {
  const s = e;
  let r = s._$litPart$;
  return r === void 0 && (s._$litPart$ = r = new Vt(e.insertBefore(Sn(), null), null, void 0, {})), r._$AI(t), r;
}, Cc = (t, e = 300) => {
  let n;
  return function(...s) {
    clearTimeout(n), n = setTimeout(() => t.apply(this, s), e);
  };
};
class iy {
  defaultData;
  localData;
  awareness = [];
  awarenessByStableId = /* @__PURE__ */ new Map();
  selfAwareness;
  element;
  _data;
  onChange;
  onAwarenessChange;
  debouncedOnChange;
  resetShortcut;
  // TODO: change this to receive the delta instead of the whole data object so you don't have to maintain
  // internal state for expressing the delta.
  updateElement;
  view;
  updateElementAwareness;
  triggerAwarenessUpdate;
  devMode;
  // Set while a `view` render is in flight, so setData/setLocalData/
  // setMyAwareness can detect (and reject) writes made synchronously during
  // render — a re-render loop.
  isRendering = !1;
  // Cleanup returned by onMount, invoked on destroy()/removePlayElement so
  // rAF loops, timers, and event listeners set up in onMount don't leak.
  onUnmount;
  // Allows the runtime to wire up capability descendants emitted by a view
  // (e.g. mount points for `define`d capabilities). Driven by descendantObserver.
  onAfterRender;
  descendantObserver;
  dataUpdateListeners = /* @__PURE__ */ new Set();
  scheduleSetupDataWrite;
  clickListener;
  touchStartListener;
  mouseDownListener;
  resetShortcutListener;
  activeDragCleanup;
  // event handlers
  onClick;
  onDrag;
  onDragStart;
  constructor(e, n = {}) {
    const {
      element: s,
      onChange: r,
      onAwarenessChange: i,
      defaultData: o,
      defaultLocalData: c,
      myDefaultAwareness: a,
      data: l,
      awareness: u,
      updateElement: h,
      view: d,
      updateElementAwareness: f,
      onMount: p,
      debounceMs: g,
      triggerAwarenessUpdate: m,
      devMode: w
    } = e;
    this.scheduleSetupDataWrite = n.scheduleSetupDataWrite, this.element = s, this.view = d, this.devMode = w, this.defaultData = o instanceof Function ? o(s) : o, this.localData = c instanceof Function ? c(s) : c, this.triggerAwarenessUpdate = m, this.onChange = r, this.debouncedOnChange = Cc(this.onChange, g), this.onAwarenessChange = i, this.updateElement = h, this.updateElementAwareness = f;
    const C = l === void 0 ? this.defaultData : l;
    u !== void 0 && (this.awareness = u);
    const v = a instanceof Function ? a(s) : a;
    if (v !== void 0 && this.setMyAwareness(v), this._data = C, this.__data = C, this.reinitializeElementData(e), p) {
      const E = p(this.getSetupData());
      typeof E == "function" && (this.onUnmount = E);
    }
  }
  /**
   * Tears down anything onMount set up (rAF loops, timers, listeners).
   * Called by removePlayElement / unregister(). Idempotent.
   */
  destroy() {
    this.descendantObserver?.disconnect(), this.descendantObserver = void 0, this.clickListener && (this.element.removeEventListener("click", this.clickListener), this.clickListener = void 0), this.touchStartListener && (this.element.removeEventListener("touchstart", this.touchStartListener), this.touchStartListener = void 0), this.mouseDownListener && (this.element.removeEventListener("mousedown", this.mouseDownListener), this.mouseDownListener = void 0), this.resetShortcutListener && (this.element.removeEventListener("click", this.resetShortcutListener), this.resetShortcutListener = void 0), this.removeActiveDragListeners(), this.onClick = void 0, this.onDrag = void 0, this.onDragStart = void 0, this.resetShortcut = void 0;
    const e = this.onUnmount;
    if (this.onUnmount = void 0, e)
      try {
        e();
      } catch (n) {
        console.error(`[playhtml] onMount cleanup for "${this.element.id}" threw`, n);
      }
  }
  reinitializeElementData({
    element: e,
    onChange: n,
    onAwarenessChange: s,
    updateElement: r,
    view: i,
    updateElementAwareness: o,
    onClick: c,
    onDrag: a,
    onDragStart: l,
    resetShortcut: u,
    debounceMs: h,
    triggerAwarenessUpdate: d,
    devMode: f
  }) {
    this.triggerAwarenessUpdate = d, this.onChange = n, this.debouncedOnChange = Cc(this.onChange, h), this.onAwarenessChange = s, this.updateElement = r, this.view = i, this.devMode = f, i && this.updateElement && (console.error(
      `[playhtml] "${e.id}" provides both \`view\` and \`updateElement\`. They are mutually exclusive — \`view\` is used and \`updateElement\` is ignored.`
    ), this.updateElement = void 0), i && (c || a || l) && (console.error(
      `[playhtml] "${e.id}" provides a \`view\` alongside onClick/onDrag/onDragStart. In view mode these are ignored — attach events inside the template (e.g. @click). `
    ), c = void 0, a = void 0, l = void 0), this.setEventHandlers({ onClick: c, onDrag: a, onDragStart: l }), u && !this.resetShortcutListener && (e.reset = this.reset, this.resetShortcutListener = (p) => {
      switch (this.resetShortcut) {
        case "ctrlKey":
          if (!p.ctrlKey)
            return;
          break;
        case "altKey":
          if (!p.altKey)
            return;
          break;
        case "shiftKey":
          if (!p.shiftKey)
            return;
          break;
        case "metaKey":
          if (!p.metaKey)
            return;
          break;
        default:
          return;
      }
      this.reset(), p.preventDefault(), p.stopPropagation();
    }, e.addEventListener("click", this.resetShortcutListener)), this.resetShortcut = u;
  }
  setEventHandlers({
    onClick: e,
    onDrag: n,
    onDragStart: s
  }) {
    const r = this.element, i = !!(this.onDrag || this.onDragStart);
    if (this.view) {
      i && this.removeActiveDragListeners(), this.onClick = void 0, this.onDrag = void 0, this.onDragStart = void 0;
      return;
    }
    const o = !!(n || s);
    i && !o && this.removeActiveDragListeners(), e && !this.clickListener && (this.clickListener = (c) => {
      this.onClick?.(c, this.getEventHandlerData());
    }, r.addEventListener("click", this.clickListener)), o && !this.touchStartListener && (this.touchStartListener = (c) => {
      if (!this.onDrag && !this.onDragStart) return;
      c.preventDefault(), this.removeActiveDragListeners(), r.classList.add("cursordown"), this.onDragStart?.(c, this.getEventHandlerData());
      const a = (u) => {
        u.preventDefault(), this.onDrag?.(u, this.getEventHandlerData());
      }, l = () => {
        r.classList.remove("cursordown"), document.removeEventListener("touchmove", a), document.removeEventListener("touchend", l), this.activeDragCleanup === l && (this.activeDragCleanup = void 0);
      };
      this.activeDragCleanup = l, document.addEventListener("touchmove", a), document.addEventListener("touchend", l);
    }, r.addEventListener("touchstart", this.touchStartListener)), o && !this.mouseDownListener && (this.mouseDownListener = (c) => {
      if (!this.onDrag && !this.onDragStart) return;
      c.preventDefault(), this.removeActiveDragListeners(), this.onDragStart?.(c, this.getEventHandlerData()), r.classList.add("cursordown");
      const a = (u) => {
        u.preventDefault(), this.onDrag?.(u, this.getEventHandlerData());
      }, l = () => {
        r.classList.remove("cursordown"), document.removeEventListener("mousemove", a), document.removeEventListener("mouseup", l), this.activeDragCleanup === l && (this.activeDragCleanup = void 0);
      };
      this.activeDragCleanup = l, document.addEventListener("mousemove", a), document.addEventListener("mouseup", l);
    }, r.addEventListener("mousedown", this.mouseDownListener)), this.onClick = e, this.onDrag = n, this.onDragStart = s;
  }
  removeActiveDragListeners() {
    this.activeDragCleanup?.(), this.activeDragCleanup = void 0, this.element.classList.remove("cursordown");
  }
  get data() {
    return this._data;
  }
  onDataUpdate(e) {
    return this.dataUpdateListeners.add(e), () => {
      this.dataUpdateListeners.delete(e);
    };
  }
  setLocalData(e) {
    this.rejectWriteDuringRender("setLocalData") || (typeof e == "function" ? e(this.localData) : this.localData = e, this.view && this.render());
  }
  /**
   * // PRIVATE USE ONLY \\
   *
   * Updates the internal state with the given data and handles all the downstream effects. Should only be used by the sync code to ensure one-way
   * reactivity.
   * (e.g. calling `updateElement`/`view` and `onChange`)
   */
  set __data(e) {
    this._data = e, this.render();
    for (const n of this.dataUpdateListeners)
      n();
  }
  /**
   * Renders the element from current state: runs `view` and patches the
   * result into the DOM via lit-html, or falls back to imperative
   * `updateElement`. Safe to call repeatedly — lit-html diffs.
   */
  render() {
    if (this.view) {
      this.isRendering = !0;
      try {
        ry(
          this.view(this.getEventHandlerData()),
          this.element
        );
      } finally {
        this.isRendering = !1;
      }
      return;
    }
    this.updateElement?.(this.getEventHandlerData());
  }
  /**
   * Begins binding capability descendants emitted by this view (mount points
   * for `define`d capabilities / `register`ed ids). Binds the current children
   * once, then re-binds only when the subtree's child structure changes — so a
   * text/attribute-only re-render (a ticking timer) does no scanning at all.
   * Called once by the runtime after `onAfterRender` is wired.
   */
  observeDescendants() {
    !this.onAfterRender || this.descendantObserver || (this.onAfterRender(this.element), typeof MutationObserver < "u" && (this.descendantObserver = new MutationObserver(() => {
      this.onAfterRender?.(this.element);
    }), this.descendantObserver.observe(this.element, {
      childList: !0,
      subtree: !0
    })));
  }
  /**
   * Re-runs the view and repaints from current state. No-op for elements
   * without a `view` (it's the view-repaint primitive), and a no-op during an
   * in-flight render (calling it from inside `view` would recurse).
   */
  requestUpdate() {
    !this.view || this.isRendering || this.render();
  }
  /** Warns and returns true if a write was attempted during a view render. */
  rejectWriteDuringRender(e) {
    return this.isRendering ? (console.error(
      `[playhtml] ${e}() was called during a view render for "${this.element.id}". Views must be pure — drive writes from @event handlers (e.g. @click) instead. Ignoring this write.`
    ), !0) : !1;
  }
  updateAwareness(e, n) {
    this.awareness = e, this.awarenessByStableId = n;
    try {
      this.updateElementAwareness?.(this.getAwarenessEventHandlerData());
    } catch (s) {
      console.error(
        "[playhtml] updateElementAwareness callback threw:",
        s
      );
    }
    this.view && this.render();
  }
  getEventHandlerData() {
    return {
      element: this.element,
      data: this.data,
      localData: this.localData,
      awareness: this.awareness,
      awarenessByStableId: this.awarenessByStableId,
      setData: (e) => this.setData(e),
      setLocalData: (e) => this.setLocalData(e),
      setMyAwareness: (e) => this.setMyAwareness(e),
      requestUpdate: () => this.requestUpdate()
    };
  }
  getAwarenessEventHandlerData() {
    return {
      ...this.getEventHandlerData(),
      myAwareness: this.selfAwareness
    };
  }
  getSetupData() {
    return {
      getElement: () => this.element,
      getData: () => this.data,
      getLocalData: () => this.localData,
      getAwareness: () => this.awareness,
      setData: (e) => this.setSetupData(e),
      setLocalData: (e) => this.setLocalData(e),
      setMyAwareness: (e) => this.setMyAwareness(e),
      requestUpdate: () => this.requestUpdate()
    };
  }
  setSetupData(e) {
    if (!this.scheduleSetupDataWrite) {
      this.setData(e);
      return;
    }
    this.rejectWriteDuringRender("setData") || this.scheduleSetupDataWrite(() => {
      this.onChange(e);
    });
  }
  /**
   * Public setter for element data.
   *
   * Semantics:
   * - Mutator form: setData((draft) => { ... })
   *   When data is backed by SyncedStore/Yjs (dataMode = "syncedstore"),
   *   the draft is a live CRDT proxy. You can mutate nested arrays/objects
   *   and the change will be merged across clients without conflicts.
   *   Example:
   *     setData(d => { d.list.push(item); });
   *
   * - Value form: setData(value)
   *   Replaces the entire data snapshot. Use this when you need canonical
   *   replacement semantics (e.g., snapshot from a mirror) or when running
   *   in legacy plain mode. Example:
   *     setData({ on: true });
   *
   * Notes:
   * - In plain mode, only the value form results in a sync; mutating draft
   *   is a no-op. Prefer the mutator form for merge-friendly edits.
   * - Directly mutating eventData.data may work in SyncedStore mode, but the
   *   recommended portable pattern is setData(draft => { ... }).
   */
  setData(e) {
    this.rejectWriteDuringRender("setData") || this.onChange(e);
  }
  // TODO: this should be keyed on the element to avoid conflicts
  setMyAwareness(e) {
    this.rejectWriteDuringRender("setMyAwareness") || e !== this.selfAwareness && (this.selfAwareness = e, this.onAwarenessChange(e), this.triggerAwarenessUpdate?.());
  }
  setDataDebounced(e) {
    this.debouncedOnChange(e);
  }
  /**
   * Resets the element to its default state.
   */
  reset() {
    this.defaultData !== void 0 && this.setData(this.defaultData);
  }
}
async function oy(t, e) {
  const n = new TextEncoder().encode(`${t}-${e.outerHTML}}`), s = await crypto.subtle.digest("SHA-1", n);
  return Array.from(new Uint8Array(s)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function yt(t, e) {
  const n = t.__playhtml_cursors__;
  return t.__playhtml_identity__?.publicKey ?? n?.playerIdentity?.publicKey ?? String(e);
}
function cy(t) {
  const e = [], n = Array.from(t.keys()).sort((s, r) => s - r);
  for (const s of n) {
    const r = t.get(s);
    if (!r) continue;
    const i = Object.keys(r).filter((o) => !o.startsWith("__")).sort();
    for (const o of i) {
      const c = r[o];
      if (c == null || typeof c != "object") continue;
      const a = c, l = Object.keys(a).sort();
      for (const u of l)
        try {
          e.push(
            `${s}:${o}:${u}:${JSON.stringify(a[u])}`
          );
        } catch {
        }
    }
  }
  return e.join("|");
}
class ay {
  cellSize;
  grid = /* @__PURE__ */ new Map();
  constructor(e = 200) {
    this.cellSize = e;
  }
  getCellKey(e, n) {
    const s = Math.floor(e / this.cellSize), r = Math.floor(n / this.cellSize);
    return `${s},${r}`;
  }
  getNearbyCellKeys(e, n, s) {
    const r = [], i = Math.ceil(s / this.cellSize), o = Math.floor(e / this.cellSize), c = Math.floor(n / this.cellSize);
    for (let a = -i; a <= i; a++)
      for (let l = -i; l <= i; l++)
        r.push(`${o + a},${c + l}`);
    return r;
  }
  insert(e) {
    const n = this.getCellKey(e.x, e.y);
    this.grid.has(n) || this.grid.set(n, /* @__PURE__ */ new Map()), this.grid.get(n).set(e.id, e);
  }
  remove(e, n, s) {
    if (n !== void 0 && s !== void 0) {
      const r = this.getCellKey(n, s), i = this.grid.get(r);
      if (i && i.has(e))
        return i.delete(e), i.size === 0 && this.grid.delete(r), !0;
    } else
      for (const [r, i] of this.grid)
        if (i.has(e))
          return i.delete(e), i.size === 0 && this.grid.delete(r), !0;
    return !1;
  }
  update(e, n, s) {
    n !== void 0 && s !== void 0 ? this.remove(e.id, n, s) : this.remove(e.id), this.insert(e);
  }
  findNearby(e, n, s, r) {
    const i = [], o = this.getNearbyCellKeys(e, n, s), c = s * s;
    for (const a of o) {
      const l = this.grid.get(a);
      if (l)
        for (const u of l.values()) {
          if (r && u.id === r) continue;
          const h = u.x - e, d = u.y - n;
          h * h + d * d <= c && i.push(u);
        }
    }
    return i;
  }
  getAll() {
    const e = [];
    for (const n of this.grid.values())
      e.push(...n.values());
    return e;
  }
  clear() {
    this.grid.clear();
  }
  // Debug info
  getCellCount() {
    return this.grid.size;
  }
  getItemCount() {
    let e = 0;
    for (const n of this.grid.values())
      e += n.size;
    return e;
  }
}
const Qn = "__playhtml_identity__", Sc = "__playhtml_cursors__";
function Wi(t) {
  const e = t.playerStyle?.colorPalette?.[0];
  if (e == null || e === "")
    throw new Error(
      "[playhtml] Player identity must have playerStyle.colorPalette[0] (primary color)."
    );
  return e;
}
function Ec(t) {
  if (!t.publicKey)
    throw new Error("[playhtml] Player identity must have publicKey.");
  Wi(t);
}
function qt(t, e) {
  return {
    pid: t.publicKey,
    name: t.name,
    color: Wi(t),
    isMe: e
  };
}
function Jl(t, e) {
  let n = t;
  Ec(n);
  const s = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new WeakSet();
  let o = null, c = null, a = "";
  function l() {
    e.getAwareness().setLocalStateField(Qn, n);
  }
  function u() {
    e.getAwareness().getLocalState()?.[Qn] || l();
  }
  function h(y, _, V) {
    for (const O of y)
      try {
        O(_);
      } catch (K) {
        console.error(`[playhtml] ${V} subscriber threw:`, K);
      }
  }
  function d() {
    h(s, n, "users self-change");
  }
  function f() {
    if (r.size === 0) return;
    const y = v();
    h(r, y, "users change");
  }
  function p() {
    const y = e.getAwareness();
    o !== y && (o = y, !i.has(y) && (i.add(y), a = g(y.getStates()), y.on("change", m)));
  }
  function g(y) {
    const _ = [], V = Array.from(y.keys()).sort((O, K) => O - K);
    for (const O of V) {
      const K = y.get(O);
      if (!K) continue;
      const Vn = K[Qn] ?? K[Sc]?.playerIdentity;
      try {
        _.push(`${O}:${JSON.stringify(Vn ?? null)}`);
      } catch {
        _.push(`${O}:null`);
      }
    }
    return _.join("|");
  }
  function m() {
    const y = e.getAwareness().getStates(), _ = g(y);
    _ !== a && (a = _, f());
  }
  function w() {
    if (u(), p(), !c && e.onCursorPresencesChange) {
      const y = e.onCursorPresencesChange(() => {
        f();
      });
      y && (c = y);
    }
  }
  function C() {
    const y = e.getAwareness(), _ = y.getLocalState();
    return _ ? yt(_, y.clientID) : n.publicKey;
  }
  function v() {
    const y = /* @__PURE__ */ new Map(), _ = e.getAwareness(), V = _.getStates(), O = C(), K = /* @__PURE__ */ new Map();
    V.forEach((Pe, le) => {
      const ue = yt(Pe, le), Kn = ue === O, Wt = K.get(ue);
      if (Wt === void 0) {
        K.set(ue, le);
        return;
      }
      if (Kn && le === _.clientID) {
        K.set(ue, le);
        return;
      }
      Kn && Wt === _.clientID || le > Wt && K.set(ue, le);
    });
    for (const [Pe, le] of K) {
      const ue = V.get(le);
      if (!ue) continue;
      const Kn = Pe === O, Wt = ue[Sc], po = ue[Qn] ?? Wt?.playerIdentity;
      if (Kn)
        y.set(Pe, qt(n, !0));
      else if (po)
        try {
          y.set(Pe, qt(po, !1));
        } catch {
        }
    }
    y.has(O) || y.set(O, qt(n, !0));
    const Vn = e.getCursorPresences?.();
    if (Vn)
      for (const [Pe, le] of Vn) {
        if (!le.playerIdentity) continue;
        const ue = Pe === O;
        try {
          y.set(
            Pe,
            ue ? qt(n, !0) : qt(le.playerIdentity, !1)
          );
        } catch {
        }
      }
    return Array.from(y.values());
  }
  function E(y) {
    y(), zr(n), l(), d(), f();
  }
  const x = {
    get pid() {
      return n.publicKey;
    },
    get name() {
      return n.name;
    },
    set name(y) {
      n.name !== y && E(() => {
        n.name = y;
      });
    },
    get color() {
      return Wi(n);
    },
    set color(y) {
      if (y == null || y === "")
        throw new Error(
          "[playhtml] users.me.color cannot be set to empty; player identity must have a primary color."
        );
      n.playerStyle.colorPalette[0] !== y && E(() => {
        n.playerStyle.colorPalette[0] = y;
      });
    }
  };
  return u(), {
    me: x,
    getAll() {
      return w(), v();
    },
    onChange(y) {
      return w(), r.add(y), y(v()), () => {
        r.delete(y);
      };
    },
    onSelfChange(y) {
      return s.add(y), () => {
        s.delete(y);
      };
    },
    adoptIdentity(y) {
      Ec(y), n !== y && E(() => {
        n = y;
      });
    },
    getIdentity() {
      return n;
    },
    destroy() {
      s.clear(), r.clear(), c?.(), c = null, o = null;
    }
  };
}
function ly() {
  return _l();
}
function br(t) {
  return Array.from(new Set(t.map((e) => e.color)));
}
class uy {
  listening = !1;
  message = "";
  chatElement = null;
  styleElement = null;
  keydownHandler = null;
  timeout = null;
  options;
  constructor(e = {}) {
    this.options = e, this.initialize();
  }
  initialize() {
    this.setupKeyboardHandlers(), this.createChatElement();
  }
  setupKeyboardHandlers() {
    this.keydownHandler = (e) => {
      if (this.timeout && clearTimeout(this.timeout), this.timeout = setTimeout(() => {
        this.setListening(!1), this.setMessage("");
      }, 1e4), !this.listening)
        e.key === "/" && (this.setMessage(""), this.setListening(!0), e.preventDefault(), e.stopPropagation());
      else if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        if (e.key === "Enter")
          this.setListening(!1);
        else if (e.key === "Escape")
          this.setListening(!1), this.setMessage("");
        else if (e.key === "Backspace")
          this.setMessage(this.message.slice(0, -1));
        else if (e.key.length === 1) {
          const n = this.message.length < 42 ? this.message + e.key : this.message;
          this.setMessage(n);
        }
        return e.preventDefault(), e.stopPropagation(), !1;
      }
    }, document.addEventListener("keydown", this.keydownHandler);
  }
  setListening(e) {
    this.listening = e, this.updateChatDisplay();
  }
  setMessage(e) {
    this.message = e, this.updateChatDisplay(), this.options.onMessageUpdate?.(e.length > 0 ? e : null);
  }
  createChatElement() {
    this.chatElement || (this.styleElement = document.createElement("style"), this.styleElement.textContent = `
      .playhtml-chat-container {
        box-sizing: border-box;
        position: fixed;
        bottom: 24px;
        right: 32px;
        padding: 8px;
        height: 48px;
        border-radius: 24px;
        min-width: 4.4em;
        background-color: rgba(52, 199, 89, 1);
        color: white;
        display: flex;
        justify-content: end;
        align-items: center;
        gap: 8px;
        font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-weight: 320;
        z-index: 1000000;
      }
      
      .playhtml-chat-input {
        box-sizing: border-box;
        padding: 0px 4px 0px 4px;
        margin: 0px;
        font-size: 24px;
        line-height: 1;
        white-space: nowrap;
        background: transparent;
        border: none;
        outline: none;
        color: white;
      }
      
      .playhtml-chat-button {
        box-sizing: border-box;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        font-weight: 250;
        padding: 0px;
        margin: 0px;
        border: 0.5px solid rgba(255,255,255,0.75);
        cursor: pointer;
        color: white;
        background-color: transparent;
      }
    `, document.head.appendChild(this.styleElement), this.chatElement = document.createElement("div"), this.chatElement.className = "playhtml-chat-container", this.chatElement.style.display = "none", document.body.appendChild(this.chatElement));
  }
  updateChatDisplay() {
    this.chatElement && (this.listening || this.message ? (this.chatElement.innerHTML = `
        <div class="playhtml-chat-input">${this.message || "..."}</div>
        <div class="playhtml-chat-button">&times;</div>
      `, this.chatElement.style.display = "flex", this.chatElement.querySelector(
      ".playhtml-chat-button"
    )?.addEventListener("click", () => {
      this.setListening(!1), this.setMessage("");
    })) : this.chatElement.style.display = "none");
  }
  showCTA() {
    this.chatElement && !this.listening && !this.message && (this.chatElement.innerHTML = '<div class="playhtml-chat-input">Type / to reply</div>', this.chatElement.style.display = "flex");
  }
  hideCTA() {
    this.chatElement && !this.listening && !this.message && (this.chatElement.style.display = "none");
  }
  getCurrentMessage() {
    return this.message.length > 0 ? this.message : null;
  }
  destroy() {
    this.keydownHandler && (document.removeEventListener("keydown", this.keydownHandler), this.keydownHandler = null), this.timeout !== null && (clearTimeout(this.timeout), this.timeout = null), this.chatElement && (this.chatElement.remove(), this.chatElement = null), this.styleElement && (this.styleElement.remove(), this.styleElement = null);
  }
}
function es(t) {
  return t === void 0 ? document.body : typeof t == "string" ? document.querySelector(t) : typeof t == "function" ? t() : t;
}
const hy = 60, dy = 30, fy = 30, py = 15e4;
function gy(t) {
  const e = Math.max(1, Math.ceil(t));
  return e <= fy ? hy : Math.min(
    dy,
    py / (e * (e - 1))
  );
}
function yy(t) {
  return 1e3 / gy(t);
}
const Xl = "identity", Yi = "element:", Gi = "presence:", my = /* @__PURE__ */ new Set([
  "playerIdentity",
  "cursor",
  "isMe"
]);
function vr(t) {
  return my.has(t);
}
function Zl(t) {
  return t.startsWith(Yi);
}
function Ql(t) {
  return t.startsWith(Gi);
}
function Cr(t) {
  return `${Gi}${t}`;
}
function wy(t) {
  return t.slice(Gi.length);
}
const Xs = 3e4, by = 1e4;
function vy(t, e, n = Xs) {
  return Number.isFinite(t) ? e - Number(t) <= n : !0;
}
function Cy(t, e, n = Xs) {
  return !z(t) || !("at" in t) ? !0 : vy(t.at, e, n);
}
function eu(t, e = by) {
  const n = setInterval(() => {
    t();
  }, e);
  return () => clearInterval(n);
}
function Sy(t, e = Date.now()) {
  return { at: e, value: t };
}
function _c(t) {
  return z(t) && "value" in t && "at" in t ? t.value : t;
}
function tu(t) {
  try {
    const e = JSON.stringify(t);
    return e === void 0 ? 1 / 0 : new TextEncoder().encode(e).byteLength;
  } catch {
    return 1 / 0;
  }
}
function nu(t) {
  const e = t[Xl];
  return z(e) && typeof e.publicKey == "string" ? e.publicKey : void 0;
}
function su(t, e, n, s) {
  if (tu(n) > As)
    return console.warn(
      `[playhtml] Failed to publish ${s}:`,
      new Error(
        `Presence value must be ${As} bytes or less`
      )
    ), !1;
  try {
    return t.update(e, n), !0;
  } catch (r) {
    return console.warn(`[playhtml] Failed to publish ${s}:`, r), !1;
  }
}
function Ls(t, e, n) {
  try {
    t.clear(e);
  } catch (s) {
    console.warn(`[playhtml] Failed to clear ${n}:`, s);
  }
}
function ve(t, e) {
  try {
    return t(), !0;
  } catch (n) {
    return console.error(`[playhtml] ${e} callback threw:`, n), !1;
  }
}
function Ey(t) {
  return z(t) && "cursor" in t;
}
function Ac(t) {
  return z(t) ? Object.values(t).every(z) : !1;
}
function _y(t) {
  return z(t) ? Object.values(t).every(
    (e) => Array.isArray(e) && e.every((n) => typeof n == "string")
  ) : !1;
}
function Ay(t) {
  return t == null ? null : typeof t == "string" ? t : null;
}
function ky(t) {
  return typeof t == "string" ? t : void 0;
}
class xy {
  constructor(e) {
    this.peerStore = e;
  }
  get peers() {
    return this.peerStore.getPeers();
  }
  getRemotePresences(e) {
    const n = /* @__PURE__ */ new Map(), s = Array.from(this.peers.keys()).sort();
    for (const r of s) {
      const i = this.getPresenceForConnection(r);
      if (!i || i.playerIdentity.publicKey === e) continue;
      const o = i.playerIdentity.publicKey, c = n.get(o);
      (!c || kc(c, i)) && n.set(o, i);
    }
    return n;
  }
  getPresenceByStableId(e) {
    let n = null;
    for (const s of Array.from(this.peers.keys()).sort()) {
      const r = this.getPresenceForConnection(s);
      r?.playerIdentity.publicKey === e && (!n || kc(n, r)) && (n = r);
    }
    return n;
  }
  getPresenceForConnection(e) {
    const n = this.peers.get(e);
    if (!n) return null;
    const s = n.identity;
    if (!og(s)) return null;
    const r = n.cursor;
    let i = null, o, c = ky(n.page), a = null;
    if (r !== void 0) {
      if (!Ey(r)) return null;
      if (r.cursor !== null) {
        if (!cg(r.cursor)) return null;
        i = r.cursor;
      }
      o = r.at, c = r.page ?? c, a = r.zone ?? null;
    }
    return {
      cursor: i,
      playerIdentity: s,
      lastSeen: o,
      message: Ay(n.message),
      page: c,
      zone: a
    };
  }
}
function kc(t, e) {
  if (e.cursor && !t.cursor) return !0;
  if (!e.cursor && t.cursor) return !1;
  const n = xc(t.lastSeen);
  return xc(e.lastSeen) > n;
}
function xc(t) {
  return Number.isFinite(t) ? Number(t) : Number.NEGATIVE_INFINITY;
}
const en = "__playhtml_cursors__";
function he(t) {
  const e = t.playerStyle?.colorPalette?.[0];
  if (e == null || e === "")
    throw new Error(
      "[playhtml] Player identity must have playerStyle.colorPalette[0] (primary color)."
    );
  return e;
}
function Dy(t) {
  if (!t.publicKey)
    throw new Error("[playhtml] Player identity must have publicKey.");
  he(t);
}
function Dc(t, e) {
  const n = t?.[en];
  if (!n?.cursor || !n.playerIdentity?.publicKey)
    return null;
  try {
    he(n.playerIdentity);
  } catch {
    return null;
  }
  return n;
}
function Sr(t, e) {
  return Math.sqrt(
    Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2)
  );
}
function ru() {
  return window.visualViewport?.scale ?? 1;
}
function Ty(t, e, n) {
  const s = ru();
  if (n === "relative") {
    const r = window.visualViewport, i = r?.width ?? window.innerWidth, o = r?.height ?? window.innerHeight, c = r?.offsetLeft ?? 0, a = r?.offsetTop ?? 0;
    return {
      x: (t + c) / (i * s) * 100,
      y: (e + a) / (o * s) * 100
    };
  } else {
    const r = window.visualViewport, i = r ? r.pageLeft : window.scrollX, o = r ? r.pageTop : window.scrollY, c = r?.offsetLeft ?? 0, a = r?.offsetTop ?? 0;
    return {
      x: (t + c) / s + i,
      y: (e + a) / s + o
    };
  }
}
function Ly(t, e, n) {
  const s = ru();
  if (n === "relative") {
    const r = window.visualViewport, i = r?.width ?? window.innerWidth, o = r?.height ?? window.innerHeight, c = r?.offsetLeft ?? 0, a = r?.offsetTop ?? 0;
    return {
      x: t / 100 * i * s - c,
      y: e / 100 * o * s - a
    };
  } else {
    const r = window.visualViewport, i = r ? r.pageLeft : window.scrollX, o = r ? r.pageTop : window.scrollY, c = r?.offsetLeft ?? 0, a = r?.offsetTop ?? 0;
    return {
      x: (t - i) * s - c,
      y: (e - o) * s - a
    };
  }
}
class Iy {
  position;
  velocity;
  target;
  stiffness;
  damping;
  mass;
  animationFrame = null;
  onUpdate;
  constructor(e, n, s = {}) {
    this.position = { ...e }, this.velocity = { x: 0, y: 0 }, this.target = { ...e }, this.onUpdate = n, this.stiffness = s.stiffness ?? 170, this.damping = s.damping ?? 26, this.mass = s.mass ?? 0.5;
  }
  setTarget(e) {
    this.target = { ...e }, this.animationFrame === null && this.animate();
  }
  animate = () => {
    const e = 0.016666666666666666, n = (this.target.x - this.position.x) * this.stiffness, s = (this.target.y - this.position.y) * this.stiffness, r = this.velocity.x * this.damping, i = this.velocity.y * this.damping, o = (n - r) / this.mass, c = (s - i) / this.mass;
    this.velocity.x += o * e, this.velocity.y += c * e, this.position.x += this.velocity.x * e, this.position.y += this.velocity.y * e, this.onUpdate(this.position);
    const a = Math.sqrt(
      Math.pow(this.target.x - this.position.x, 2) + Math.pow(this.target.y - this.position.y, 2)
    ), l = Math.sqrt(
      Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2)
    );
    a < 0.5 && l < 0.5 ? (this.position = { ...this.target }, this.velocity = { x: 0, y: 0 }, this.onUpdate(this.position), this.animationFrame = null) : this.animationFrame = requestAnimationFrame(this.animate);
  };
  // Immediately jump to a position without spring animation.
  // Used when the viewport changes (scroll/zoom) and cursors need to
  // track content instantly.
  snapTo(e) {
    this.animationFrame !== null && (cancelAnimationFrame(this.animationFrame), this.animationFrame = null), this.position = { ...e }, this.target = { ...e }, this.velocity = { x: 0, y: 0 }, this.onUpdate(this.position);
  }
  destroy() {
    this.animationFrame !== null && (cancelAnimationFrame(this.animationFrame), this.animationFrame = null);
  }
}
function iu(t) {
  t = t.replace(/"/g, "'"), t = t.replace(/>\s{1,}</g, "><"), t = t.replace(/\s{2,}/g, " ");
  const e = /[\r\n%#()<>?[\\\]^`{|}]/g;
  return t.replace(e, encodeURIComponent);
}
function ou(t) {
  return `<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="10 9 18 18"
    width="18"
    height="18"
    fill="none"
    fillRule="evenodd"
  >
    <g fill="rgba(0,0,0,.2)" transform="translate(1,1)">
      <path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
      <path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
    </g>
    <g fill="white">
      <path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
      <path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
    </g>
    <g fill="${t}">
      <path d="m19.751 24.4155-1.844.774-3.1-7.374 1.841-.775z" />
      <path d="m13 10.814v11.188l2.969-2.866.428-.139h4.768z" />
    </g>
  </svg>`;
}
function Er(t) {
  return `url("data:image/svg+xml,${iu(ou(t))}"), auto`;
}
function Tc(t) {
  return t.startsWith("--") ? t : t.replace(/[A-Z]/g, (e) => "-" + e.toLowerCase());
}
function _r(t, e, n) {
  const s = /* @__PURE__ */ new Set();
  for (const r of Object.keys(n)) {
    if (/^\d+$/.test(r)) continue;
    s.add(r);
    const i = n[r];
    t.style.setProperty(Tc(r), String(i));
  }
  for (const r of e)
    s.has(r) || t.style.removeProperty(Tc(r));
  e.clear();
  for (const r of s)
    e.add(r);
}
function My(t) {
  if (!t.startsWith('url("'))
    return;
  const e = t.indexOf('")', 5);
  if (e !== -1)
    return t.slice(5, e);
}
function ze() {
  const t = window.location.pathname;
  return t.length <= Fi ? t : void 0;
}
function $y(t) {
  if (t.trim() !== t || /["'<>\s\u0000-\u001f\u007f]/.test(t))
    return !1;
  try {
    const e = new URL(t, window.location.href);
    return e.protocol === "http:" || e.protocol === "https:" ? !0 : e.protocol !== "data:" ? !1 : /^data:image\/(?:png|jpeg|jpg|gif|webp);base64,/i.test(t);
  } catch {
    return !1;
  }
}
function ts(t) {
  return t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Oy(t) {
  const e = t.trim();
  return /^#[0-9a-fA-F]{3,8}$/.test(e) || /^rgba?\([0-9.,%\s]+\)$/.test(e) || /^hsla?\([0-9.,%\s]+\)$/.test(e) || /^[a-zA-Z]+$/.test(e) ? e : "black";
}
class Py {
  constructor(e, n = {}, s, r) {
    this.provider = e, this.options = n, this.presenceTransport = s, r ? (this.users = r, n.playerIdentity && this.users.adoptIdentity(n.playerIdentity)) : (this.users = Jl(
      n.playerIdentity ?? _l(),
      {
        getAwareness: () => this.provider.awareness,
        getCursorPresences: () => this.getCursorPresences(),
        onCursorPresencesChange: (i) => this.onCursorPresencesChange(i)
      }
    ), this.ownsUsers = !0), Dy(this.playerIdentity), this.visibilityThreshold = n.visibilityThreshold || void 0, this.coordinateMode = n.coordinateMode || "absolute", this.options.enableChat === !0 && (this.chat = new uy({
      onMessageUpdate: (i) => {
        this.currentMessage = i, this.updateCursorAwareness();
      }
    })), this.lastKnownColor = he(this.playerIdentity), this.lastKnownName = this.playerIdentity.name, this.unsubscribeSelfChange = this.users.onSelfChange(() => {
      this.handleSelfIdentityChange();
    }), this.initialize(), this.setupGlobalAPI(), this.unsubscribeUsersChange = this.users.onChange((i) => {
      this.handleUsersChange(i);
    });
  }
  cursors = /* @__PURE__ */ new Map();
  cursorAnimators = /* @__PURE__ */ new Map();
  // Spring animators for each cursor
  spatialGrid = new ay(300);
  // 300px cell size
  proximityUsers = /* @__PURE__ */ new Set();
  currentCursor = null;
  users;
  ownsUsers = !1;
  unsubscribeSelfChange = null;
  unsubscribeUsersChange = null;
  awarenessUpdateTimeout = null;
  lastUpdate = 0;
  pointerFrame = null;
  pendingPointerSample = null;
  cursorEventCleanups = [];
  ownCursorSvgCache = null;
  visibilityThreshold;
  isStylesAdded = !1;
  globalApiListeners = /* @__PURE__ */ new Map();
  activeAnimationCleanups = /* @__PURE__ */ new Map();
  // stableId -> cleanup fn
  chat = null;
  currentMessage = null;
  otherUsersWithMessages = /* @__PURE__ */ new Set();
  lastSentMessage = null;
  cursorPresenceChangeCallbacks = /* @__PURE__ */ new Map();
  coordinateMode;
  // Cursor view over the shared PeerStore; only present (and only read) in
  // transport mode. Assigned in setupPresenceTransportHandling.
  presenceStore = null;
  presenceTransportUnsubscribe = null;
  serverCursorMaxHz = null;
  // When the cursor container is a non-body element with a CSS transform,
  // cursors are stored and rendered in container-local coordinates. The
  // matrix is read live from getComputedStyle so host pan/zoom updates flow
  // through automatically. Returns null for the document.body default
  // (identity, fast path) so today's behavior is preserved.
  getContainerMatrix() {
    const e = es(this.options.container);
    if (!e || e === document.body || typeof DOMMatrixReadOnly > "u") return null;
    const n = getComputedStyle(e).transform;
    return { matrix: !n || n === "none" ? new DOMMatrixReadOnly() : new DOMMatrixReadOnly(n), rect: e.getBoundingClientRect(), el: e };
  }
  clientToStorage(e, n) {
    const s = this.getContainerMatrix();
    if (s) {
      const r = s.matrix.a, i = s.matrix.b, o = s.matrix.c, c = s.matrix.d, a = r * c - i * o;
      if (a === 0) return { x: 0, y: 0 };
      const l = e - s.rect.left, u = n - s.rect.top;
      return {
        x: (c * l - o * u) / a,
        y: (r * u - i * l) / a
      };
    }
    return Ty(e, n, this.coordinateMode);
  }
  storageToClient(e, n) {
    const s = this.getContainerMatrix();
    if (s) {
      const r = s.matrix.a, i = s.matrix.b, o = s.matrix.c, c = s.matrix.d;
      return {
        x: r * e + o * n + s.rect.left,
        y: i * e + c * n + s.rect.top
      };
    }
    return Ly(e, n, this.coordinateMode);
  }
  zones = /* @__PURE__ */ new Map();
  currentZone = null;
  cursorZoneState = /* @__PURE__ */ new Map();
  // stableId -> previous zoneId
  // Keys most recently written by getCursorStyle for each cursor. Tracked so
  // re-applying can remove stale keys when a style function returns fewer
  // properties than the previous call.
  cursorStyleKeys = /* @__PURE__ */ new Map();
  lastKnownContainer = null;
  // Maps Yjs clientId -> stableId (publicKey). Multiple clientIds can map to
  // the same stableId when a user has multiple tabs open. Used to:
  // (a) skip rendering our own cursor from other tabs
  // (b) collapse multiple tabs from the same remote user into one cursor
  // (c) clean up cursor elements correctly when a clientId disconnects
  clientIdToStableId = /* @__PURE__ */ new Map();
  // Tracks pending fade-out removal timeouts by stableId so they can be
  // cancelled if a new update arrives for the same stableId (e.g. when one
  // tab disconnects but another tab of the same user is still active).
  pendingRemovals = /* @__PURE__ */ new Map();
  // Cursor client no longer owns identity mutation/persistence — it reads the
  // live reference from the users module, which is the sole mutator.
  get playerIdentity() {
    return this.users.getIdentity();
  }
  // Tracks the previously observed color/name so handleSelfIdentityChange
  // can emit CursorEvents only for fields that actually changed (mirroring what
  // the pre-refactor window.cursors setters and configure() did).
  lastKnownColor = "";
  lastKnownName;
  lastKnownAllColors = [];
  // React to any users.me mutation (color/name/whole-identity adopt):
  // invalidate the cached own-cursor SVG, refresh the document cursor style,
  // republish our cursor awareness, and emit the CursorEvents subscribers
  // (window.cursors.on) already rely on, only for fields that changed. The
  // identity channel itself is republished by the shared transport's
  // onSelfChange re-join (see acquirePresenceTransport), not here.
  handleSelfIdentityChange() {
    this.ownCursorSvgCache = null;
    const e = he(this.playerIdentity);
    document.documentElement.style.cursor = Er(e), this.updateCursorAwareness();
    const n = this.playerIdentity.name;
    e !== this.lastKnownColor && (this.lastKnownColor = e, this.emitGlobalEvent("color", e)), n !== this.lastKnownName && (this.lastKnownName = n, this.emitGlobalEvent("name", n));
  }
  handleUsersChange(e) {
    const n = br(e);
    n.length === this.lastKnownAllColors.length && n.every(
      (s, r) => s === this.lastKnownAllColors[r]
    ) || (this.lastKnownAllColors = n, this.emitGlobalEvent("allColors", n));
  }
  initialize() {
    this.addCursorStyles(), this.setupCursorTracking(), this.presenceTransport ? this.setupPresenceTransportHandling() : this.setupAwarenessHandling(), document.documentElement.style.cursor = Er(
      he(this.playerIdentity)
    );
  }
  setupAwarenessHandling() {
    this.provider.awareness.on("change", ({ added: e, updated: n, removed: s }) => {
      this.handleAwarenessChange(e, n, s);
    }), this.updateCursorAwareness(), this.syncExistingAwareness();
  }
  setupPresenceTransportHandling() {
    if (!this.presenceTransport) return;
    this.presenceStore = new xy(this.presenceTransport.peers), this.publishPresenceTransportState();
    const e = () => this.onPeerCursorChange(), n = this.presenceTransport.peers.subscribe(
      "cursor",
      e
    ), s = this.presenceTransport.peers.subscribe(
      "identity",
      e
    ), r = this.presenceTransport.subscribe((i) => {
      this.handlePresenceControlMessage(i);
    });
    this.presenceTransportUnsubscribe = () => {
      n(), s(), r();
    };
  }
  onPeerCursorChange() {
    this.renderPresenceStore();
  }
  handlePresenceControlMessage(e) {
    e.type === "presence-rate" && this.handlePresenceRate(e.channel, e.hz);
  }
  handlePresenceRate(e, n) {
    e === "cursor" && (!Number.isFinite(n) || n <= 0 || (this.serverCursorMaxHz = n));
  }
  renderPresenceStore() {
    const e = /* @__PURE__ */ new Set();
    for (const [n, s] of this.cursorPresenceEntries())
      e.add(n), s.cursor ? this.updateCursor(n, {
        ...s,
        cursor: s.cursor
      }) : this.removeCursor(n), s.message ? this.otherUsersWithMessages.add(n) : this.otherUsersWithMessages.delete(n);
    for (const n of Array.from(this.cursors.keys()))
      e.has(n) || (this.otherUsersWithMessages.delete(n), this.removeCursor(n));
    this.rebuildSpatialGrid(), this.updateChatCTA(), this.checkProximityOptimized(), this.notifyCursorPresenceListeners();
  }
  syncExistingAwareness() {
    const e = this.provider.awareness.getStates(), n = Array.from(e.keys());
    this.handleAwarenessChange(n, [], []);
  }
  handleAwarenessChange(e, n, s) {
    const r = this.provider.awareness.getStates(), i = this.provider.awareness.clientID, o = this.playerIdentity.publicKey;
    [...e, ...n].forEach((c) => {
      const a = r.get(c);
      let l = a ? yt(a, c) : String(c);
      if (l === String(c) && (l = this.clientIdToStableId.get(c) ?? l), this.clientIdToStableId.set(c, l), c === i || l === o)
        return;
      const u = Dc(a);
      u ? this.updateCursor(l, u) : this.hasOtherClientForStableId(l, c) || this.removeCursor(l), a?.[en]?.message ? this.otherUsersWithMessages.add(l) : this.otherUsersWithMessages.delete(l);
    }), s.forEach((c) => {
      const a = this.clientIdToStableId.get(c);
      this.clientIdToStableId.delete(c), a && (this.otherUsersWithMessages.delete(a), this.hasOtherClientForStableId(a, c) || this.removeCursor(a));
    }), this.rebuildSpatialGrid(), this.updateChatCTA(), this.checkProximityOptimized(), this.notifyCursorPresenceListeners();
  }
  // Returns true if any clientId other than the excluded one maps to the given stableId.
  hasOtherClientForStableId(e, n) {
    for (const [s, r] of this.clientIdToStableId)
      if (r === e && s !== n) return !0;
    return !1;
  }
  *cursorPresenceEntries(e = {}) {
    if (this.presenceTransport && this.presenceStore) {
      const i = this.presenceStore.getRemotePresences(
        this.playerIdentity.publicKey
      );
      for (const [o, c] of i)
        yield [o, c];
      return;
    }
    const n = this.provider.awareness.getStates(), s = this.provider.awareness.clientID, r = this.playerIdentity.publicKey;
    for (const [i, o] of n) {
      const c = yt(
        o,
        i
      );
      if (!e.includeLocalAwareness && (i === s || c === r))
        continue;
      const a = Dc(
        o
      );
      a && (yield [c, a]);
    }
  }
  *activeCursorPresenceEntries(e = {}) {
    const n = e.now ?? Date.now();
    for (const [s, r] of this.cursorPresenceEntries())
      r.cursor && (e.freshOnly && !this.isFreshCursorPresence(r, n) || (yield [
        s,
        {
          ...r,
          cursor: r.cursor
        }
      ]));
  }
  // A stricter, SYNCHRONOUS freshness check for proximity (freshOnly): between
  // PeerStore sweep ticks a cursor can be technically stale but not yet swept,
  // and it must not participate in proximity. Distinct from PeerStore's
  // sweep-based channel deletion — both run, at different cadences.
  isFreshCursorPresence(e, n) {
    return this.presenceTransport ? Number.isFinite(e.lastSeen) ? n - Number(e.lastSeen) <= Xs : !1 : !0;
  }
  rebuildSpatialGrid() {
    this.spatialGrid.clear();
    for (const [e, n] of this.activeCursorPresenceEntries()) {
      const s = this.storageToClient(
        n.cursor.x,
        n.cursor.y
      );
      this.spatialGrid.insert({
        id: e,
        x: s.x,
        y: s.y,
        data: n
      });
    }
  }
  checkProximityOptimized() {
    if (!this.currentCursor) return;
    const e = /* @__PURE__ */ new Set(), n = this.options.proximityThreshold || Zp, s = this.storageToClient(this.currentCursor.x, this.currentCursor.y), r = this.spatialGrid.findNearby(
      s.x,
      s.y,
      n
    );
    for (const i of r) {
      const o = i.data;
      if (!o.cursor) continue;
      const c = this.storageToClient(o.cursor.x, o.cursor.y);
      if (Sr(
        {
          x: s.x,
          y: s.y,
          pointer: this.currentCursor.pointer
        },
        {
          x: c.x,
          y: c.y,
          pointer: o.cursor.pointer
        }
      ) < n && (e.add(i.id), !this.proximityUsers.has(i.id))) {
        const u = {
          ours: { x: this.currentCursor.x, y: this.currentCursor.y },
          theirs: { x: o.cursor.x, y: o.cursor.y }
        }, h = o.cursor.x - this.currentCursor.x, d = o.cursor.y - this.currentCursor.y, f = Math.atan2(d, h);
        this.options.onProximityEntered?.(
          o.playerIdentity,
          u,
          f
        );
      }
    }
    for (const i of this.proximityUsers)
      e.has(i) || this.options.onProximityLeft?.(i);
    this.proximityUsers = e;
  }
  addCursorStyles() {
    if (this.isStylesAdded || document.getElementById("playhtml-cursor-styles"))
      return;
    const e = document.createElement("style");
    e.id = "playhtml-cursor-styles", e.textContent = `
      .playhtml-cursor-other {
        position: fixed;
        width: 32px;
        height: 32px;
        pointer-events: none;
        z-index: 999999;
        transition: all 0.1s ease;
        transform-origin: center;
      }
      
      .playhtml-cursor-fade-in {
        animation: cursorFadeIn 0.3s ease-out;
      }
      
      .playhtml-cursor-fade-out {
        animation: cursorFadeOut 0.3s ease-out;
        opacity: 0;
      }
      
      @keyframes cursorFadeIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
      }
      
      @keyframes cursorFadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
      }
    `;
    const n = es(this.options.container);
    n && n !== document.body ? n.appendChild(e) : document.head.appendChild(e), this.isStylesAdded = !0;
  }
  // Build the onUpdate callback for a SpringAnimator. Position values are
  // always in pixel space — zone-relative coordinates are resolved to pixels
  // before being fed to the spring.
  createCursorPositionCallback(e) {
    return (n) => {
      const s = this.cursors.get(e);
      s && (s.style.position = this.coordinateMode === "absolute" || this.getContainerMatrix() ? "absolute" : "fixed", s.style.left = `${n.x}px`, s.style.top = `${n.y}px`, s.style.zIndex = "999999", s.style.pointerEvents = "none");
    };
  }
  // Resolves storage coordinates to the coordinate space used for positioning.
  // In absolute mode (default container) storage coords are document coords
  // and cursors use position:absolute, so no conversion is needed. With a
  // transformed cursor container, storage coords are container-local — and
  // since cursors are appended inside that container with position:absolute,
  // the CSS transform composes them into the right viewport pixels for free,
  // so again no conversion is needed. Relative mode converts to viewport
  // pixels for position:fixed.
  resolveTargetCoords(e, n) {
    return this.coordinateMode === "absolute" || this.getContainerMatrix() ? { x: e, y: n } : this.storageToClient(e, n);
  }
  // Apply zone-specific cursor styling, or revert to global styling when
  // leaving a zone. Uses applyTrackedStyles so keys written by a previous
  // call that aren't in the new style object are removed, rather than
  // lingering on the element.
  applyZoneStyling(e, n, s, r) {
    let i = this.cursorStyleKeys.get(r);
    if (i || (i = /* @__PURE__ */ new Set(), this.cursorStyleKeys.set(r, i)), s) {
      const o = this.zones.get(s);
      if (o?.options?.getCursorStyle) {
        _r(
          e,
          i,
          o.options.getCursorStyle(n)
        );
        return;
      }
    }
    this.options.getCursorStyle ? _r(
      e,
      i,
      this.options.getCursorStyle(n)
    ) : _r(e, i, {});
  }
  hitTestZones(e, n) {
    let s = null, r = 1 / 0;
    for (const [i, { element: o }] of this.zones) {
      if (!document.contains(o)) continue;
      const c = o.getBoundingClientRect();
      if (e >= c.left && e <= c.right && n >= c.top && n <= c.bottom) {
        const a = c.width * c.height;
        a < r && (r = a, s = {
          zoneId: i,
          relX: Math.max(0, Math.min(1, (e - c.left) / c.width)),
          relY: Math.max(0, Math.min(1, (n - c.top) / c.height))
        });
      }
    }
    return s;
  }
  getOwnCursorSvg() {
    const e = he(this.playerIdentity);
    return this.ownCursorSvgCache?.color !== e && (this.ownCursorSvgCache = {
      color: e,
      svg: iu(ou(e))
    }), this.ownCursorSvgCache.svg;
  }
  addCursorEventListener(e, n, s, r) {
    e.addEventListener(n, s, r), this.cursorEventCleanups.push(() => {
      e.removeEventListener(n, s, r);
    });
  }
  requestPointerFrame(e) {
    return typeof window.requestAnimationFrame == "function" ? window.requestAnimationFrame(e) : window.setTimeout(() => e(performance.now()), 1e3 / 60);
  }
  cancelPointerFrame(e) {
    typeof window.cancelAnimationFrame == "function" ? window.cancelAnimationFrame(e) : window.clearTimeout(e);
  }
  queuePointerSample(e, n, s) {
    this.pendingPointerSample = { clientX: e, clientY: n, input: s }, this.pointerFrame === null && (this.pointerFrame = this.requestPointerFrame(() => {
      this.pointerFrame = null;
      const r = this.pendingPointerSample;
      this.pendingPointerSample = null, r && this.processPointerSample(r);
    }));
  }
  processPointerSample(e) {
    let n = e.input;
    if (e.input === "mouse") {
      n = "mouse";
      const r = document.elementFromPoint(e.clientX, e.clientY);
      if (r) {
        const i = window.getComputedStyle(r), o = My(i.cursor);
        o && !o.includes(this.getOwnCursorSvg()) && (n = o);
      }
      n === "mouse" ? document.documentElement.style.cursor = Er(
        he(this.playerIdentity)
      ) : document.documentElement.style.cursor = "auto";
    }
    const s = this.clientToStorage(e.clientX, e.clientY);
    this.currentCursor = {
      x: s.x,
      y: s.y,
      pointer: n
    }, this.currentZone = this.hitTestZones(e.clientX, e.clientY), this.scheduleCursorAwarenessUpdate(), this.updateAllCursorVisibility();
  }
  setupCursorTracking() {
    const e = (o) => {
      const c = o;
      this.queuePointerSample(c.clientX, c.clientY, "mouse");
    }, n = (o) => {
      const a = o.touches[0];
      a && this.queuePointerSample(a.clientX, a.clientY, "touch");
    }, s = () => {
    };
    this.addCursorEventListener(document, "mousemove", e), this.addCursorEventListener(document, "touchmove", n, {
      passive: !0
    }), this.addCursorEventListener(document, "touchend", s), this.addCursorEventListener(document, "mouseleave", () => {
      this.showAllCursors();
    });
    let r = null;
    const i = () => {
      r === null && (r = requestAnimationFrame(() => {
        r = null, this.repositionAllCursors();
      }));
    };
    this.addCursorEventListener(window, "scroll", i, {
      passive: !0
    }), this.addCursorEventListener(window, "resize", i), window.visualViewport && (this.addCursorEventListener(
      window.visualViewport,
      "scroll",
      i
    ), this.addCursorEventListener(
      window.visualViewport,
      "resize",
      i
    )), this.addCursorEventListener(window, "beforeunload", () => {
      this.presenceTransport ? this.presenceTransport.clear("cursor") : this.provider.awareness.setLocalStateField(en, null);
    });
  }
  // Re-derive positions for all remote cursors. In relative mode, this is
  // needed on every scroll/resize since cursors use position:fixed with
  // viewport-relative coords. In absolute mode, non-zone cursors use
  // position:absolute and the browser handles scroll — only zone cursors
  // need re-resolution (getBoundingClientRect changes on scroll).
  repositionAllCursors() {
    for (const [e, n] of this.activeCursorPresenceEntries())
      this.snapCursorToPresence(e, n);
    this.updateAllCursorVisibility();
  }
  snapCursorToPresence(e, n) {
    const s = this.cursorAnimators.get(e);
    if (!s) return;
    if (n.zone) {
      const i = this.zones.get(n.zone.zoneId);
      if (i && document.contains(i.element)) {
        const o = i.element.getBoundingClientRect(), c = this.cursors.get(e), a = c ? c.offsetWidth / 2 : 0, l = c ? c.offsetHeight / 2 : 0, u = o.left + n.zone.relX * o.width - a, h = o.top + n.zone.relY * o.height - l;
        this.coordinateMode === "absolute" ? s.snapTo({
          x: u + window.scrollX,
          y: h + window.scrollY
        }) : s.snapTo({ x: u, y: h });
        return;
      }
    }
    if (this.coordinateMode === "absolute" || this.getContainerMatrix()) return;
    const r = this.storageToClient(
      n.cursor.x,
      n.cursor.y
    );
    s.snapTo({ x: r.x, y: r.y });
  }
  getActiveCursorConnectionCount() {
    const e = this.currentCursor ? 1 : 0;
    let n = 0;
    for (const s of this.activeCursorPresenceEntries({
      freshOnly: !0
    }))
      n++;
    return Math.max(1, e + n);
  }
  scheduleCursorAwarenessUpdate() {
    if (this.awarenessUpdateTimeout !== null) return;
    const n = performance.now() - this.lastUpdate, s = yy(
      this.getActiveCursorConnectionCount()
    ), r = this.serverCursorMaxHz ? 1e3 / this.serverCursorMaxHz : 0, i = Math.max(s, r);
    n >= i ? this.updateCursorAwareness() : this.awarenessUpdateTimeout = setTimeout(() => {
      this.awarenessUpdateTimeout = null, this.updateCursorAwareness();
    }, i - n);
  }
  updateCursorAwareness() {
    this.awarenessUpdateTimeout !== null && (clearTimeout(this.awarenessUpdateTimeout), this.awarenessUpdateTimeout = null);
    const e = Date.now(), n = {
      cursor: this.currentCursor,
      playerIdentity: this.playerIdentity,
      lastSeen: e,
      message: this.currentMessage,
      page: ze(),
      zone: this.currentZone
    };
    if (this.presenceTransport) {
      this.presenceTransport.update("cursor", {
        cursor: n.cursor,
        page: n.page,
        zone: n.zone,
        at: e
      }), this.currentMessage !== this.lastSentMessage && (this.presenceTransport.update("message", this.currentMessage), this.lastSentMessage = this.currentMessage), this.lastUpdate = performance.now(), this.checkProximityOptimized(), this.notifyCursorPresenceListeners();
      return;
    }
    this.provider.awareness.setLocalStateField(
      en,
      n
    ), this.lastUpdate = performance.now();
  }
  publishPresenceTransportState() {
    if (!this.presenceTransport) return;
    const e = ze();
    this.presenceTransport.join({
      identity: this.playerIdentity,
      page: e
    }), this.currentCursor && this.presenceTransport.update("cursor", {
      cursor: this.currentCursor,
      page: e,
      zone: this.currentZone,
      at: Date.now()
    }), (this.currentMessage !== null || this.lastSentMessage !== null) && (this.presenceTransport.update("message", this.currentMessage), this.lastSentMessage = this.currentMessage);
  }
  getContainer() {
    const e = es(this.options.container) ?? document.body;
    return this.lastKnownContainer = e, e;
  }
  refreshContainer() {
    const e = es(this.options.container) ?? document.body;
    if (e === this.lastKnownContainer) return;
    const n = this.lastKnownContainer;
    this.lastKnownContainer = e, n && n.querySelectorAll(".playhtml-cursor-other").forEach((o) => e.appendChild(o));
    const r = document.getElementById("playhtml-cursor-styles");
    r && r.parentElement !== e && e.appendChild(r);
  }
  // Re-invoke getCursorStyle for all currently rendered cursors. Called after
  // SPA navigation so consumers can re-evaluate per-page visibility decisions.
  refreshCursorStyles() {
    if (!(!this.options.getCursorStyle && this.zones.size === 0))
      for (const [e, n] of this.cursors.entries()) {
        const s = this.findAwarenessByStableId(e);
        if (!s) continue;
        const r = this.cursorZoneState.get(e) ?? null;
        this.applyZoneStyling(n, s, r, e);
      }
  }
  findAwarenessByStableId(e) {
    for (const [n, s] of this.activeCursorPresenceEntries())
      if (n === e) return s;
    return null;
  }
  updateCursor(e, n) {
    const s = this.pendingRemovals.get(e);
    if (s) {
      clearTimeout(s), this.pendingRemovals.delete(e);
      const w = this.cursors.get(e);
      w && (w.classList.remove("playhtml-cursor-fade-out"), w.classList.add("playhtml-cursor-fade-in"));
    }
    const r = n.playerIdentity;
    if (this.options.shouldRenderCursor && !this.options.shouldRenderCursor(n)) {
      this.removeCursor(e);
      return;
    }
    let i = this.cursors.get(e);
    const o = n.cursor, c = i && i.dataset.pointerType !== o.pointer;
    !i || c ? (i && i.remove(), i = this.createCursorElement(
      r,
      o.pointer,
      n.message,
      e,
      n
    ), i.dataset.pointerType = o.pointer, this.cursors.set(e, i), this.getContainer().appendChild(i)) : i && (this.updateCursorMessage(i, r, n.message), this.updateCursorName(i, r));
    const a = n.zone, l = this.cursorZoneState.get(e) ?? null, u = a?.zoneId ?? null, h = l !== u;
    this.cursorZoneState.set(e, u);
    let d, f = !1;
    if (a) {
      const w = this.zones.get(a.zoneId);
      if (w && document.contains(w.element)) {
        const C = w.element.getBoundingClientRect(), v = this.cursors.get(e), E = v ? v.offsetWidth / 2 : 0, x = v ? v.offsetHeight / 2 : 0, y = C.left + a.relX * C.width - E, _ = C.top + a.relY * C.height - x;
        this.coordinateMode === "absolute" ? d = {
          x: y + window.scrollX,
          y: _ + window.scrollY
        } : d = { x: y, y: _ }, f = !0;
      } else
        d = this.resolveTargetCoords(o.x, o.y);
    } else
      d = this.resolveTargetCoords(o.x, o.y);
    this.applyZoneStyling(
      i,
      n,
      f ? u : null,
      e
    );
    let p = d.x, g = d.y;
    if (this.coordinateMode === "relative") {
      const C = window.innerWidth, v = window.innerHeight;
      p = Math.max(
        -18,
        Math.min(C - 2, d.x)
      ), g = Math.max(
        -18,
        Math.min(v - 2, d.y)
      );
    }
    let m = this.cursorAnimators.get(e);
    if (m || (m = new Iy(
      { x: p, y: g },
      this.createCursorPositionCallback(e)
    ), this.cursorAnimators.set(e, m)), h ? m.snapTo({ x: p, y: g }) : m.setTarget({ x: p, y: g }), this.currentCursor) {
      const w = this.storageToClient(this.currentCursor.x, this.currentCursor.y), C = Sr(
        { x: d.x, y: d.y, pointer: o.pointer },
        {
          x: w.x,
          y: w.y,
          pointer: this.currentCursor.pointer
        }
      ), v = this.visibilityThreshold ? C < this.visibilityThreshold : !0;
      i.style.display = v ? "block" : "none", i.style.opacity = v ? "1" : "0", i.dataset.animating || (i.style.transform = v ? "scale(1)" : "scale(0.8)");
    } else
      i.style.display = "block", i.style.opacity = "1", i.dataset.animating || (i.style.transform = "scale(1)");
  }
  createCursorElement(e, n = "mouse", s, r, i) {
    const o = document.createElement("div");
    if (o.className = "playhtml-cursor-other playhtml-cursor-fade-in", r && this.options.onCustomCursorRender) {
      const a = this.options.onCustomCursorRender(
        r,
        o
      );
      if (a)
        return a;
    }
    const c = Oy(he(e));
    switch (n) {
      case "mouse":
        o.innerHTML = this.getMouseCursorSVG(c);
        break;
      case "touch":
        o.innerHTML = this.getTouchCursorSVG(c);
        break;
      default:
        o.innerHTML = $y(n) ? this.getCustomCursorSVG(c, n) : this.getMouseCursorSVG(c);
        break;
    }
    if (this.options.cursorStyle && (o.style.cssText += this.options.cursorStyle), this.updateCursorMessage(o, e, s), this.updateCursorName(o, e), this.options.getCursorStyle && i) {
      const a = this.options.getCursorStyle(i);
      Object.assign(o.style, a);
    }
    return o;
  }
  getMouseCursorSVG(e) {
    return `
      <svg
        height="32"
        viewBox="0 0 32 32"
        width="32"
        xmlns="http://www.w3.org/2000/svg"
        style="pointer-events: none;"
      >
        <g fill="none" fillRule="evenodd" transform="translate(10 7)">
          <path
            d="m6.148 18.473 1.863-1.003 1.615-.839-2.568-4.816h4.332l-11.379-11.408v16.015l3.316-3.221z"
            fill="#fff"
          />
          <path
            d="m6.431 17 1.765-.941-2.775-5.202h3.604l-8.025-8.043v11.188l2.53-2.442z"
            fill="${ts(e)}"
          />
        </g>
      </svg>
    `;
  }
  getTouchCursorSVG(e) {
    return `
      <svg
        height="32"
        viewBox="0 0 32 32"
        width="32"
        xmlns="http://www.w3.org/2000/svg"
        style="pointer-events: none;"
      >
        <g fill="none" fillRule="evenodd" transform="translate(9 8)">
          <path
            d="m3.8852309 13.5522788c.15029277.1354048.25406355.2326609.57471053.5372549.31406586.2983172.46594413.439273.60482646.5572091.05791893.0487853.10729946.1792495.12686364.3731628.01609788.1595565.01049553.3375341-.0090192.5090254-.00674888.0593077-.01325791.1020883-.01698742.1224696-.04186639.2287942.13249226.4401222.36507344.4424801.20929712.0021219.37056581.00472.79741331.0123273.10679864.0019014.10679864.0019014.21395196.0037648 1.16029156.0199598 1.75290683.01448 2.1782236-.039003.45462139-.05716.92282087-.6061887 1.32754658-1.2951218.3429437.6096032.818651 1.2048784 1.2990136 1.282277.1525992.0243739.3372104.0319365.5511764.0270146.1595258-.0036697.328349-.0141847.4987188-.0294071.1284742-.0114791.2308379-.0230173.2919821-.0309462.2259121-.0292954.3737346-.2515956.31337-.4712558-.0130388-.0474468-.0339905-.1345046-.0551176-.2441066-.0244927-.1270617-.0421932-.2511642-.0502379-.3642189-.0051002-.0716765-.0061057-.1365707-.0028638-.1926702.0056365-.097781.007395-.1525378.0101327-.2790463.0010457-.0470941.0010457-.0470941.0024433-.0883088.0052898-.134881.0234093-.2629524.0820463-.5422232.0251901-.1212103.1472903-.3531692.3395862-.6402332.0572734-.0854992.1198813-.1747825.1869659-.2669588.127207-.1747861.2641214-.3514011.4010853-.5204043.0820457-.1012383.1454717-.1769623.1807968-.2180763.2962199-.424403.6120842-1.1191696.7281396-1.5253635.111416-.3904017.2005405-1.10937558.2553074-1.81604479.0300143-.40088807.0411211-.72405394.0411211-1.23097561.0000507-.08891816.0000507-.08891816.0002032-.16234685.0002858-.12025251.0003032-.16573976-.0000887-.22195195-.0010706-.15358041-.0055478-.30580145-.0203882-.6940256-.0319191-.81365149-.4778003-1.3396911-1.1348711-1.44115781-.5589865-.08632026-1.2393839.37795756-1.2393839.37795756s-.1514404-.5228127-.2537197-.6842075c-.1661957-.25934741-.5941748-.58982828-.9213451-.65421118-.3365014-.0653413-.7354024-.05811592-1.1017193.00667481-.3207944.05740454-.64034865.34382687-.82518751.65277182-.13223727.22039488-.00786932-.01169164-.14013104-.2396787-.1830552-.31402315-.60932935-.59522407-1.01524567-.67822294-.34396352-.07112559-.73801897-.04403625-1.09795562.06293793-.46304125.13836397-.53675291.49073282-.55516748.38984626-.06158674-.3382385-.06727482-.3160095-.105656-.55729603-.14258072-.89527436-.30213161-1.51473549-.54406219-2.05528331.01391678.0310773-.08860981-.20214701-.12592279-.28256779-.06461002-.13925416-.12910532-.2652956-.19999629-.38652204-.21850342-.37364978-.46891278-.65340904-.7830908-.81233894-.54561037-.27629378-1.3634177-.14183064-1.75105565.31064856-.38495968.44966797-.4491432 1.20149287-.3521966 2.13184003.03702376.36121263.16678627 1.02066144.28444961 1.50812387.04160602.1691894.07805979.32348903.14491578.60851331.01149723.04848415.01149723.04848415.02309483.09698036.05172236.21571896.09707607.39320067.15122332.5879629-.00568154-.02030261.09701461.344086.11888835.42472961.00727686.02691587.00727686.02691587.01448296.05395339.04082856.15377935.08074083.31959314.14309954.5963099.03412572.1521447.06742545.31468601.09999775.48699018.08883553.46993091.089274.37207374.00375852.27186198-.05907319-.06922522-.11463055-.13209255-.16830659-.19003644-.09976937-.10770214-.19148509-.19677225-.2785569-.2678141-.6343975-.51905295-1.02312991-.74839425-1.55681885-.79878106-.87541567-.08410158-1.70619803.53426712-1.83111632 1.36882761-.07682697.51169638-.05207639.74723271.18463583 1.19942735.13026223.24432805.35060714.53942202.76172732 1.04735429.02515953.031068.02515953.031068.05030428.06206416.50464537.62186746.55962098.69095396.67961467.86473786.32435479.4706845 1.1139501 1.8221455 1.25748612 2.0035872z"
            fill="${ts(e)}"
          />
          <path
            d="m1.68266944 9.2716401c-.02488625-.03067752-.02488625-.03067752-.04970567-.06132555-.37729166-.46613768-.58418002-.74321015-.68156241-.9258495-.15281729-.29195235-.1611316-.37107459-.10605794-.73788601.06473349-.43247455.53181583-.78013371 1.01829549-.73339767.33660502.03178017.63068475.20527903 1.15339692.63295262.0565942.04617564.12482853.1124417.20288232.19670163.04616569.04983637.09513192.10524534.14800114.16720042.0794093.0930562.34702847.42052231.30761424.37286894.05814283.06991619.09971852.12407704.14721655.19045018.0941062.13434104.14705111.20894642.21874992.30454484-.0336171-.04487143.21473082.29843305.26732159.34863333.27859812.26593456.68203289.04195871.65675979-.31244785-.00421914-.05916537-.01812774-.12308431-.04717934-.23466885-.11487425-.81923739-.15505751-1.08218312-.24678252-1.56739907-.03407352-.18024544-.06905328-.35098727-.10521102-.5121905-.06435409-.28557213-.10635725-.46007245-.14994794-.62425526-.00774801-.02907063-.00774801-.02907063-.01552357-.05783095-.02300644-.08481964-.12725123-.45470311-.12030828-.42989063-.05134381-.18468043-.0945453-.35373996-.14431997-.56133562-.01130896-.04728909-.01130896-.04728909-.02259904-.09489949-.06649254-.28350912-.10387999-.44176072-.14606063-.6132721-.10998732-.45567652-.23425389-1.08719519-.2671036-1.40768017-.07546665-.72422018-.02339381-1.33418457.17582284-1.56688778.15554834-.1815673.59641015-.25405339.84271752-.12932486.16107512.0814814.32204278.26131571.47435101.521769.05764302.09857191.11172763.20426801.16708381.32357735.0335256.07225783.13292567.29837003.12172905.27336705.21032209.46992469.354801 1.03086841.48791736 1.86671535.03939531.24766201.08813662.52823537.15063928.87150416.01857903.10178746.01857903.10178746.03722922.20314381.30139226 1.63533599.27933797 1.51139381.28367122 1.64182468.01580667.47578071.71810567.4869267.74900255.01188722.00979855-.15065269.00630989-.2851661-.01107827-.67146517-.00245496-.05465243-.00245496-.05465243-.00481877-.10910149-.01521525-.35590459-.01433687-.56066672.00670546-.67705709.03834708-.21223125.22887-.4499778.40434754-.50241339.24641865-.07323589.51640341-.09179599.73269877-.04707051.20703808.0423346.44864736.20171736.51796318.32062499.08353628.14399789.15516008.36337367.21006107.63530456.04431149.21947986.07480439.45493493.0962536.70624261.00667352.0781897.01103024.13859819.01772256.23854675.00285005.04183594.00285005.04183594.00568968.07635213.00160285.01731471.00160285.01731471.00551199.04467336.00303535.01917374.00303535.01917374.01734216.06773608.00727602.13782339.00727602.13782339.56081544.18893151.16530264-.19982737.16530264-.19982737.16077268-.23486454.02708074-.1183491.04365279-.250265.06727822-.49813693.01508098-.16112409.02268576-.24033521.03157416-.32249887.036794-.34012028.0835164-.55621578.140511-.65120691.0707148-.11819408.3197845-.28280909.4314962-.30279961.2805348-.04961763.5886064-.0551978.8264635-.00901194.1077347.021202.3705429.22413969.4327499.32121002.1277282.20156171.2519621.8513817.3219188 1.49611734-.0110122.04228902-.0110122.04228902.1607163.28760404.5903408-.06730286.5903408-.06730286.5737568-.17389206.0155734-.03799147.0279666-.08191522.0455068-.15013809.0421947-.1597068.0701719-.25243998.1118273-.35635899.0288165-.07188915.0591935-.13335501.0903398-.18227881.120675-.18992919.4330876-.31896311.7070596-.2766556.2942545.0454396.4817569.26665023.4998934.72896761.0145423.38042999.0188438.52667972.0198445.67022961.0003693.0529684.0003531.09548963.0000723.21509672-.0001536.07391241-.0001536.07391241-.000205.16397385 0 .48892448-.010469.79353263-.0389535 1.17400348-.0506294.653266-.1361064 1.34281542-.228649 1.66708482-.094456.330596-.3764591.9508823-.5997469 1.2734975-.0158389.0153017-.0838055.0964468-.1706932.2036597-.1445918.1784155-.2892331.364998-.4248114.5512865-.0725632.099704-.140705.1968792-.2036767.2908847-.2436695.3637558-.4000227.6607868-.4506249.9042828-.0664376.3164194-.0901813.4842425-.0973169.666189-.0017426.0515155-.0017426.0515155-.0028439.1014735-.0025547.1180556-.0040857.165727-.0090621.2520573-.0052398.0906702-.0037444.1871795.0035093.2891187.0103883.145992.0000001.3454812.0000001.3454812s-.1266332-.0118299-.2678551-.0085813c-.1725177.0039685-.3159859-.0019087-.4151297-.0177442-.143046-.0230487-.5293508-.5064503-.7271506-.8830611-.3022704-.5764228-1.03604858-.5484427-1.33684295-.0394061-.27130191.4618137-.65965243.9172085-.77493336.9317029-.37460536.047106-.95471158.0524702-2.07175566.0332544-.10679478-.0018572-.10679478-.0018572-.21348729-.0037567-.42889761-.0076439-.41241496.0647655-.40363307-.0124079.02506967-.2203068.02222332-.1790312.00000011-.3992999-.03726222-.36933-.15125405-.6704984-.38877094-.8705429-.12286946-.1043424-.26983033-.2407345-.56500741-.5211097-.33722428-.3203411-.44283686-.4193233-.57299128-.5337266l-.80130455-.8907189c-.08795856-.1124788-.86002339-1.4339349-1.21248613-1.9454077-.13710846-.19857111-.18839645-.26302343-.71461353-.9114734zm9.50873056.0037599v3.459c0 .5.75.5.75 0v-3.459c0-.5-.75-.5-.75 0zm-2.03159602-.00057241.016 3.47300001c.00230346.4999947.7522955.4965395.74999204-.0034552l-.016-3.47299999c-.00230346-.4999947-.7522955-.49653951-.74999204.00345518zm-1.20911102 3.45357381-.021-3.42599996c-.00306475-.4999906-.75305066-.49539349-.74998592.00459712l.021 3.42600004c.00306475.4999906.75305066.4953935.74998592-.0045972z"
            fill="#fff"
          />
        </g>
      </svg>
    `;
  }
  getCustomCursorSVG(e, n) {
    return `
      <svg
        height="32"
        viewBox="0 0 32 32"
        width="32"
        xmlns="http://www.w3.org/2000/svg"
        style="filter: drop-shadow(0 0 0.25rem ${ts(e)}); pointer-events: none;"
      >
        <g fill="none" fillRule="evenodd" transform="translate(9 8)">
          <image href="${ts(n)}" width="32" height="32"></image>
        </g>
      </svg>
    `;
  }
  removeCursor(e) {
    const n = this.cursors.get(e);
    if (n) {
      n.classList.remove("playhtml-cursor-fade-in"), n.classList.add("playhtml-cursor-fade-out");
      const r = this.pendingRemovals.get(e);
      r && clearTimeout(r);
      const i = setTimeout(() => {
        n.remove(), this.cursors.delete(e), this.pendingRemovals.delete(e);
      }, 300);
      this.pendingRemovals.set(e, i);
    }
    const s = this.cursorAnimators.get(e);
    s && (s.destroy(), this.cursorAnimators.delete(e)), this.cursorZoneState.delete(e), this.cursorStyleKeys.delete(e);
  }
  setupGlobalAPI() {
    const e = this;
    window.cursors = {
      get allColors() {
        return br(e.users.getAll());
      },
      get color() {
        return e.users.me.color;
      },
      set color(n) {
        e.users.me.color = n;
      },
      get name() {
        return e.users.me.name;
      },
      set name(n) {
        e.users.me.name = n;
      },
      on: (n, s) => {
        e.globalApiListeners.has(n) || e.globalApiListeners.set(n, /* @__PURE__ */ new Set()), e.globalApiListeners.get(n).add(s);
      },
      off: (n, s) => {
        const r = e.globalApiListeners.get(n);
        r && r.delete(s);
      }
    };
  }
  emitGlobalEvent(e, n) {
    const s = this.globalApiListeners.get(e);
    if (s)
      for (const r of s)
        try {
          r(n);
        } catch (i) {
          console.error(
            `[playhtml] cursors "${e}" subscriber threw:`,
            i
          );
        }
  }
  updateChatCTA() {
    this.chat && (this.otherUsersWithMessages.size > 0 ? this.chat.showCTA() : this.chat.hideCTA());
  }
  updateCursorMessage(e, n, s) {
    const r = e.querySelector(".playhtml-cursor-message");
    if (r && r.remove(), s) {
      const i = document.createElement("div");
      i.className = "playhtml-cursor-message", i.style.cssText = `
        position: absolute;
        font-size: 16px;
        font-style: normal;
        font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        color: white;
        padding: 4px 9px 4px 9px;
        border-radius: 16px 16px 16px 16px;
        white-space: nowrap;
        background-color: rgba(52,199,89,1);
        top: 17px;
        left: 22px;
      `, i.textContent = s, e.appendChild(i);
    }
  }
  updateCursorName(e, n) {
    const s = e.querySelector(".playhtml-cursor-name");
    s && s.remove();
    const r = n?.name;
    if (r && n) {
      const i = he(n), o = r.length > 10 ? r.slice(0, 10) + ".." : r, c = this.opacifyColor(i, 0.6), a = this.opacifyColor(i, 0.3), l = this.getContrastColor(i), u = document.createElement("div");
      u.className = "playhtml-cursor-name", u.style.cssText = `
        position: absolute;
        white-space: nowrap;
        padding: 4px 6px;
        font-size: 12px;
        background: ${i};
        border-radius: 14px;
        top: 14px;
        left: 18px;
        opacity: 0.75;
        border: 1px solid ${c};
        box-shadow: 1px 1px 4px 2px ${a};
        color: ${l};
      `, u.textContent = o, e.appendChild(u);
    }
  }
  opacifyColor(e, n) {
    if (e.startsWith("#")) {
      const s = e.replace("#", ""), r = parseInt(s.substring(0, 2), 16), i = parseInt(s.substring(2, 4), 16), o = parseInt(s.substring(4, 6), 16);
      return `rgba(${r}, ${i}, ${o}, ${n})`;
    } else {
      if (e.startsWith("rgba"))
        return e.replace(/[\d\.]+\)$/, `${n})`);
      if (e.startsWith("rgb"))
        return e.replace("rgb", "rgba").replace(")", `, ${n})`);
      if (e.startsWith("hsl")) {
        const s = e.match(
          /hsl\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)%,\s*(\d+(?:\.\d+)?)%\)/
        );
        if (s) {
          const [, r, i, o] = s.map(Number), [c, a, l] = this.hslToRgb(r, i, o);
          return `rgba(${c}, ${a}, ${l}, ${n})`;
        }
      }
    }
    return e;
  }
  hslToRgb(e, n, s) {
    e /= 360, n /= 100, s /= 100;
    let r, i, o;
    if (n === 0)
      r = i = o = s;
    else {
      const c = (u, h, d) => (d < 0 && (d += 1), d > 1 && (d -= 1), d < 0.16666666666666666 ? u + (h - u) * 6 * d : d < 0.5 ? h : d < 0.6666666666666666 ? u + (h - u) * (0.6666666666666666 - d) * 6 : u), a = s < 0.5 ? s * (1 + n) : s + n - s * n, l = 2 * s - a;
      r = c(l, a, e + 1 / 3), i = c(l, a, e), o = c(l, a, e - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(i * 255), Math.round(o * 255)];
  }
  getLuminance(e) {
    let n, s, r;
    if (e.startsWith("#")) {
      const a = e.replace("#", "");
      n = parseInt(a.substring(0, 2), 16), s = parseInt(a.substring(2, 4), 16), r = parseInt(a.substring(4, 6), 16);
    } else if (e.startsWith("rgb")) {
      const a = e.match(/\d+/g);
      if (!a || a.length < 3) return 0;
      [n, s, r] = a.map(Number);
    } else if (e.startsWith("hsl")) {
      const a = e.match(/\d+(\.\d+)?/g);
      if (!a || a.length < 3) return 0;
      const [l, u, h] = a.map(Number);
      [n, s, r] = this.hslToRgb(l, u, h);
    } else
      return 0;
    const [i, o, c] = [n / 255, s / 255, r / 255].map(
      (a) => a <= 0.03928 ? a / 12.92 : Math.pow((a + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * i + 0.7152 * o + 0.0722 * c;
  }
  getContrastColor(e) {
    return this.getLuminance(e) > 0.5 ? "#000000" : "#ffffff";
  }
  updateAllCursorVisibility() {
    if (!this.currentCursor || !this.visibilityThreshold) return;
    const e = this.storageToClient(this.currentCursor.x, this.currentCursor.y);
    this.cursors.forEach((n, s) => {
      const i = this.spatialGrid.getAll().find((o) => o.id === s)?.data;
      if (i && i.cursor) {
        const o = this.storageToClient(i.cursor.x, i.cursor.y), a = Sr(
          { ...e, pointer: this.currentCursor.pointer },
          { ...o, pointer: i.cursor.pointer }
        ) < this.visibilityThreshold;
        n.style.display = a ? "block" : "none", n.style.opacity = a ? "1" : "0", n.dataset.animating || (n.style.transform = a ? "scale(1)" : "scale(0.8)");
      }
    });
  }
  showAllCursors() {
    this.cursors.forEach((e) => {
      e.style.display = "block", e.style.opacity = "1", e.dataset.animating || (e.style.transform = "scale(1)");
    });
  }
  configure(e) {
    if (Object.assign(this.options, e), e.shouldRenderCursor !== void 0)
      for (const [n, s] of this.activeCursorPresenceEntries())
        this.updateCursor(n, s);
    e.visibilityThreshold !== void 0 && (this.visibilityThreshold = e.visibilityThreshold, this.updateAllCursorVisibility()), e.playerIdentity !== void 0 && this.users.adoptIdentity(e.playerIdentity);
  }
  registerZone(e, n) {
    if (!e.id)
      throw new Error("[playhtml] Zone element must have an id attribute.");
    this.zones.set(e.id, { element: e, options: n });
  }
  unregisterZone(e) {
    this.zones.delete(e);
  }
  hideCursor(e) {
    const n = this.cursors.get(e);
    n && (n.style.display = "none");
  }
  showCursor(e) {
    const n = this.cursors.get(e);
    n && (n.style.display = "block");
  }
  destroy() {
    this.unsubscribeSelfChange?.(), this.unsubscribeSelfChange = null, this.unsubscribeUsersChange?.(), this.unsubscribeUsersChange = null, this.ownsUsers && this.users.destroy(), this.cursorEventCleanups.forEach((e) => e()), this.cursorEventCleanups = [], this.pointerFrame !== null && (this.cancelPointerFrame(this.pointerFrame), this.pointerFrame = null), this.pendingPointerSample = null, this.awarenessUpdateTimeout !== null && (clearTimeout(this.awarenessUpdateTimeout), this.awarenessUpdateTimeout = null), this.cursors.forEach((e) => e.remove()), this.cursors.clear(), this.cursorAnimators.forEach((e) => e.destroy()), this.cursorAnimators.clear(), this.spatialGrid.clear(), this.zones.clear(), this.cursorZoneState.clear(), this.cursorStyleKeys.clear(), this.clientIdToStableId.clear(), this.pendingRemovals.forEach((e) => clearTimeout(e)), this.pendingRemovals.clear(), this.chat && this.chat.destroy(), this.presenceTransport ? (this.presenceTransportUnsubscribe?.(), this.presenceTransportUnsubscribe = null, this.presenceTransport.clear("cursor")) : this.provider.awareness.setLocalStateField(en, null);
  }
  // Debug method to inspect spatial partitioning efficiency
  getDebugInfo() {
    const e = this.spatialGrid.getItemCount(), n = this.spatialGrid.getCellCount();
    return {
      totalCursors: e,
      gridCells: n,
      avgCursorsPerCell: n > 0 ? e / n : 0
    };
  }
  // Instance-level subscription API (mirrors window.cursors.on/off)
  on(e, n) {
    this.globalApiListeners.has(e) || this.globalApiListeners.set(e, /* @__PURE__ */ new Set()), this.globalApiListeners.get(e).add(n);
  }
  off(e, n) {
    const s = this.globalApiListeners.get(e);
    s && s.delete(n);
  }
  // Snapshot of current cursor-related values for consumers
  getSnapshot() {
    return {
      allColors: br(this.users.getAll()),
      color: he(this.playerIdentity),
      name: this.playerIdentity.name ?? void 0
    };
  }
  // Get my player identity (including stable publicKey)
  getMyPlayerIdentity() {
    return this.playerIdentity;
  }
  // Get the provider (needed for awareness access)
  getProvider() {
    return this.provider;
  }
  // Get all cursor presences keyed by stable ID (slim shape for rendering).
  // Cursor coordinates are converted from storage (e.g. viewport % when coordinateMode is "relative")
  // to client pixel coordinates so consumers can use them directly for CSS left/top.
  getCursorPresences() {
    const e = /* @__PURE__ */ new Map();
    if (this.presenceTransport) {
      const n = ze(), s = this.currentCursor ? this.storageToClient(this.currentCursor.x, this.currentCursor.y) : null;
      e.set(this.playerIdentity.publicKey, {
        cursor: s && this.currentCursor ? {
          x: s.x,
          y: s.y,
          pointer: this.currentCursor.pointer
        } : null,
        playerIdentity: this.playerIdentity,
        zone: this.currentZone,
        page: n
      });
    }
    for (const [n, s] of this.cursorPresenceEntries({
      includeLocalAwareness: !this.presenceTransport
    })) {
      const r = s.cursor ? this.storageToClient(s.cursor.x, s.cursor.y) : null;
      e.set(n, {
        cursor: r && s.cursor ? {
          x: r.x,
          y: r.y,
          pointer: s.cursor.pointer
        } : null,
        playerIdentity: s.playerIdentity,
        zone: s.zone,
        // Expose the reader's pathname so consumers can group presences by
        // page — e.g. a docs sidebar can show "who is reading which page"
        // without maintaining a parallel room-per-page structure.
        page: s.page
      });
    }
    return e;
  }
  // Subscribe to cursor presence changes
  onCursorPresencesChange(e) {
    const n = Math.random().toString(36);
    return this.cursorPresenceChangeCallbacks.set(n, e), () => {
      this.cursorPresenceChangeCallbacks.delete(n);
    };
  }
  // Notify listeners of cursor presence changes
  notifyCursorPresenceListeners() {
    const e = this.getCursorPresences();
    this.cursorPresenceChangeCallbacks.forEach((n) => n(e));
  }
  /**
   * Apply a CSS class to a specific cursor element identified by the player's stableId (publicKey).
   * The class is added to the actual rendered cursor DOM element and removed after `durationMs`.
   * Returns true if the cursor element was found and the animation was applied.
   */
  triggerCursorAnimation(e, n, s = 1500) {
    const r = this.activeAnimationCleanups.get(e);
    if (r && r(), e === this.playerIdentity.publicKey)
      return this.triggerSelfCursorAnimation(n, s);
    const o = this.cursors.get(e);
    if (!o) return !1;
    const c = o.querySelector("svg") ?? o;
    o.dataset.animating = "true";
    const a = o.style.display, l = o.style.opacity;
    o.style.display = "block", o.style.opacity = "1";
    const u = o.style.transition;
    o.style.transition = "none", c.classList.add(n);
    let h = !1;
    const d = () => {
      h || (h = !0, c.classList.remove(n), delete o.dataset.animating, o.style.transition = u, o.style.display = a, o.style.opacity = l, this.activeAnimationCleanups.delete(e));
    };
    this.activeAnimationCleanups.set(e, d);
    const f = () => {
      d(), c.removeEventListener("animationend", f);
    };
    return c.addEventListener("animationend", f), window.setTimeout(f, s), !0;
  }
  // Create a temporary ghost cursor at the local player's position and animate it
  triggerSelfCursorAnimation(e, n) {
    if (!this.currentCursor) return !1;
    const s = he(this.playerIdentity), r = this.storageToClient(this.currentCursor.x, this.currentCursor.y), i = document.createElement("div");
    i.className = `playhtml-cursor-other ${e}`, i.style.cssText = `
      position: fixed;
      left: ${r.x - 16}px;
      top: ${r.y - 16}px;
      width: 32px;
      height: 32px;
      z-index: 999999;
      pointer-events: none;
      opacity: 0.3;
      transform-origin: top left;
    `, i.innerHTML = this.getMouseCursorSVG(s), document.body.appendChild(i);
    const o = this.playerIdentity.publicKey;
    let c = !1;
    const a = () => {
      c || (c = !0, i.removeEventListener("animationend", l), i.remove(), this.activeAnimationCleanups.delete(o));
    };
    this.activeAnimationCleanups.set(o, a);
    const l = () => a();
    return i.addEventListener("animationend", l), window.setTimeout(a, n), !0;
  }
}
const ns = "__presence__", Lc = "__playhtml_cursors__", Xr = "__playhtml_identity__", Ry = /* @__PURE__ */ new Set(["playerIdentity", "cursor", "isMe"]);
function cu(t) {
  const e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new WeakSet();
  let s = null, r = 0;
  function i() {
    return t.getAwareness();
  }
  function o() {
    t.publishIdentity !== !1 && Ny(i(), t.getPlayerIdentity());
  }
  function c(g, m) {
    const w = [], C = Array.from(g.keys()).sort((v, E) => v - E);
    for (const v of C) {
      const E = g.get(v);
      if (!E) continue;
      let x;
      m === "cursor" ? x = E[Lc]?.cursor : x = E[ns]?.[m];
      try {
        w.push(`${v}:${JSON.stringify(x ?? null)}`);
      } catch {
        w.push(`${v}:null`);
      }
    }
    return w.join("|");
  }
  function a() {
    if (e.size === 0) return;
    const g = i().getStates();
    let m = null;
    const w = () => (m || (m = f()), m);
    for (const C of e.values()) {
      const v = c(
        g,
        C.channel
      );
      v !== C.lastFingerprint && (C.lastFingerprint = v, C.callback(w()));
    }
  }
  function l() {
    const g = i();
    s !== g && (s = g, !n.has(g) && (n.add(g), g.on("change", a)));
  }
  function u() {
    e.size > 0 && l();
  }
  function h(g, m) {
    const w = g[Lc], C = g[Xr] ?? w?.playerIdentity, v = w?.cursor ?? null, E = g[ns] ?? {}, x = {
      playerIdentity: C,
      cursor: v,
      isMe: m
    };
    for (const [y, _] of Object.entries(E))
      !Ry.has(y) && _ != null && (x[y] = _);
    return x;
  }
  function d() {
    const g = i(), m = g.getLocalState();
    return m ? yt(m, g.clientID) : t.getPlayerIdentity().publicKey;
  }
  function f() {
    const g = /* @__PURE__ */ new Map(), m = i(), w = m.getStates(), C = m.clientID, v = d();
    let E = !1;
    const x = /* @__PURE__ */ new Map();
    w.forEach((y, _) => {
      const V = yt(y, _), O = V === v, K = x.get(V);
      if (K === void 0) {
        x.set(V, _);
        return;
      }
      if (O && _ === C) {
        x.set(V, _);
        return;
      }
      O && K === C || _ > K && x.set(V, _);
    });
    for (const [y, _] of x) {
      const V = w.get(_);
      if (!V) continue;
      const O = y === v;
      O && (E = !0), g.set(y, h(V, O));
    }
    if (!E) {
      const y = m.getLocalState() ?? {}, _ = h(y, !0);
      _.playerIdentity = t.getPlayerIdentity(), g.set(v, _);
    }
    return p(g, v), g;
  }
  function p(g, m) {
    const w = t.getCursorPresences?.();
    if (w)
      for (const [C, v] of w) {
        const E = g.get(C);
        g.set(C, {
          ...E,
          playerIdentity: v.playerIdentity ?? E?.playerIdentity,
          cursor: v.cursor ?? null,
          isMe: C === m
        });
      }
  }
  return {
    setMyPresence(g, m) {
      o(), u();
      const w = i(), v = (w.getLocalState() ?? {})[ns] ?? {};
      let E;
      if (m == null) {
        const { [g]: x, ...y } = v;
        E = y;
      } else
        E = { ...v, [g]: m };
      w.setLocalStateField(ns, E);
    },
    getPresences() {
      return o(), u(), f();
    },
    onPresenceChange(g, m) {
      if (o(), g === "cursor" && t.onCursorPresencesChange) {
        const E = t.onCursorPresencesChange(() => {
          m(f());
        });
        return m(f()), E;
      }
      const w = String(r++), C = i().getStates(), v = c(C, g);
      return e.set(w, { channel: g, callback: m, lastFingerprint: v }), l(), m(f()), () => {
        e.delete(w);
      };
    },
    getMyIdentity() {
      return t.getPlayerIdentity();
    }
  };
}
function Ny(t, e) {
  t.getLocalState()?.[Xr] || t.setLocalStateField(Xr, e);
}
const au = /* @__PURE__ */ new Map();
function lu(t, e) {
  au.set(t, e);
}
function Uy() {
  const t = [];
  return document.querySelectorAll("[shared]").forEach((e) => {
    if (!e.id) return;
    let n = "read-write";
    const s = e.getAttribute("shared");
    if (s && s !== "") {
      const r = s.toLowerCase();
      (r.includes("read-only") || r === "ro") && (n = "read-only");
    }
    t.push({
      elementId: e.id,
      permissions: n,
      path: window.location.pathname
    });
  }), t;
}
function Fy() {
  const t = [];
  return document.querySelectorAll("[data-source]").forEach((e) => {
    const n = e.getAttribute("data-source");
    if (n)
      try {
        const { domain: s, path: r, elementId: i } = Tl(n);
        t.push({ domain: s, path: r, elementId: i });
      } catch {
      }
  }), t;
}
function jy(t, e) {
  if (t.hasAttribute("data-source") && t.hasAttribute("data-source-read-only")) return !0;
  const r = e ?? Fn(t);
  return r ? au.get(r) === "read-only" : !1;
}
const J = "__page__";
function uu(t) {
  return `${J}:${t}`;
}
function hu(t, e, n) {
  const { getStorePlay: s, yObserverByKey: r } = e, i = uu(t);
  if (r.has(i)) return;
  const o = ye(s()[J]?.[t]);
  if (!o || typeof o.observeDeep != "function") return;
  let c = !1;
  const a = () => {
    c || (c = !0, queueMicrotask(() => {
      c = !1;
      const l = s()[J]?.[t];
      if (!l) return;
      const u = We(l);
      for (const h of n)
        h(u);
    }));
  };
  o.observeDeep(a), r.set(i, a);
}
function du(t) {
  const { channelListeners: e, getStorePlay: n } = t;
  for (const [s, r] of e) {
    const i = n()[J]?.[s];
    if (!i) continue;
    hu(s, t, r);
    const o = We(i);
    for (const c of r)
      c(o);
  }
}
function Hy(t, e, n) {
  const {
    ensureProxy: s,
    getProxy: r,
    getDoc: i,
    getStorePlay: o,
    proxyByTagAndId: c,
    yObserverByKey: a,
    channelRefCounts: l,
    channelListeners: u
  } = n, h = () => o(), d = () => i();
  h()[J] ??= {}, s(J, t, e), u.has(t) || u.set(t, /* @__PURE__ */ new Set());
  const f = u.get(t), p = /* @__PURE__ */ new Set();
  function g() {
    hu(t, n, f);
  }
  const m = (l.get(t) ?? 0) + 1;
  l.set(t, m), g();
  let w = !1;
  return {
    getData() {
      if (w) throw new Error(`PageDataChannel "${t}" has been destroyed`);
      return We(h()[J]?.[t] ?? e);
    },
    setData(C) {
      if (w) throw new Error(`PageDataChannel "${t}" has been destroyed`);
      let v = r(J, t);
      v == null && (v = s(J, t, e), g());
      const E = v;
      typeof C == "function" ? d().transact(() => {
        C(E);
      }) : d().transact(() => {
        xs(E, C);
      });
    },
    onUpdate(C) {
      if (w) throw new Error(`PageDataChannel "${t}" has been destroyed`);
      return f.add(C), p.add(C), () => {
        f.delete(C), p.delete(C);
      };
    },
    destroy() {
      if (w) return;
      w = !0;
      for (const v of p)
        f.delete(v);
      p.clear();
      const C = (l.get(t) ?? 1) - 1;
      if (l.set(t, C), C <= 0) {
        l.delete(t), u.delete(t);
        const v = uu(t), E = a.get(v);
        if (E) {
          const y = ye(h()[J]?.[t]);
          y && typeof y.unobserveDeep == "function" && y.unobserveDeep(E), a.delete(v);
        }
        const x = c.get(J);
        x && x.delete(t);
      }
    }
  };
}
const zy = "playhtml.syncedStore is read-only.", By = /* @__PURE__ */ new Set([
  "copyWithin",
  "fill",
  "pop",
  "push",
  "reverse",
  "shift",
  "sort",
  "splice",
  "unshift"
]);
function Et() {
  throw new Error(zy);
}
function Vy(t) {
  return Array.isArray(t) ? [] : {};
}
function Ic(t, e) {
  !Array.isArray(t) || !Array.isArray(e) || (e.length = t.length);
}
function fu(t) {
  const e = /* @__PURE__ */ new WeakMap();
  function n(s) {
    if (s === null || typeof s != "object")
      return s;
    const r = e.get(s);
    if (r)
      return r;
    const i = s, o = Vy(i), c = new Proxy(o, {
      get(a, l) {
        return Array.isArray(i) && By.has(l) ? Et : n(Reflect.get(i, l, i));
      },
      getOwnPropertyDescriptor(a, l) {
        if (Ic(i, o), Array.isArray(i) && l === "length")
          return Reflect.getOwnPropertyDescriptor(o, l);
        const u = Reflect.getOwnPropertyDescriptor(
          i,
          l
        );
        return u && ("value" in u ? {
          ...u,
          configurable: !0,
          value: n(u.value),
          writable: !1
        } : {
          configurable: !0,
          enumerable: u.enumerable,
          value: n(
            Reflect.get(i, l, i)
          ),
          writable: !1
        });
      },
      has(a, l) {
        return l in i;
      },
      ownKeys() {
        return Ic(i, o), Reflect.ownKeys(i);
      },
      getPrototypeOf() {
        return Reflect.getPrototypeOf(i);
      },
      set: Et,
      deleteProperty: Et,
      defineProperty: Et,
      setPrototypeOf: Et,
      preventExtensions: Et
    });
    return e.set(s, c), c;
  }
  return n(t);
}
(!globalThis.EventTarget || !globalThis.Event) && console.error(`
  PartySocket requires a global 'EventTarget' class to be available!
  You can polyfill this global by adding this to your code before any partysocket imports: 
  
  \`\`\`
  import 'partysocket/event-target-polyfill';
  \`\`\`
  Please file an issue at https://github.com/partykit/partykit if you're still having trouble.
`);
var pu = class extends Event {
  message;
  error;
  constructor(t, e) {
    super("error", e), this.message = t.message, this.error = t;
  }
}, gu = class extends Event {
  code;
  reason;
  wasClean = !0;
  constructor(t = 1e3, e = "", n) {
    super("close", n), this.code = t, this.reason = e;
  }
};
const Ar = {
  Event,
  ErrorEvent: pu,
  CloseEvent: gu
};
function Ky(t, e) {
  if (!t) throw new Error(e);
}
function Wy(t) {
  return new t.constructor(t.type, t);
}
function Yy(t) {
  return "data" in t ? new MessageEvent(t.type, t) : "code" in t || "reason" in t ? new gu(t.code || 1999, t.reason || "unknown reason", t) : "error" in t ? new pu(t.error, t) : new Event(t.type, t);
}
const Gy = typeof process < "u" && typeof process.versions?.node < "u", qy = typeof navigator < "u" && navigator.product === "ReactNative", ss = Gy || qy ? Yy : Wy, Xe = {
  maxReconnectionDelay: 1e4,
  minReconnectionDelay: 3e3,
  minUptime: 5e3,
  reconnectionDelayGrowFactor: 1.3,
  connectionTimeout: 4e3,
  maxRetries: Number.POSITIVE_INFINITY,
  maxEnqueuedMessages: Number.POSITIVE_INFINITY
};
let Mc = !1;
function Jy() {
}
var Xy = class Re extends EventTarget {
  _ws;
  _retryCount = -1;
  _uptimeTimeout;
  _connectTimeout;
  _shouldReconnect = !0;
  _connectLock = !1;
  _binaryType = "blob";
  _closeCalled = !1;
  _didWarnAboutClosedSend = !1;
  _messageQueue = [];
  _debugLogger = console.log.bind(console);
  _url;
  _protocols;
  _options;
  constructor(e, n, s = {}) {
    super(), this._url = e, this._protocols = n, this._options = s, this._options.startClosed && (this._shouldReconnect = !1), this._options.debugLogger && (this._debugLogger = this._options.debugLogger), this._connect();
  }
  static get CONNECTING() {
    return 0;
  }
  static get OPEN() {
    return 1;
  }
  static get CLOSING() {
    return 2;
  }
  static get CLOSED() {
    return 3;
  }
  get CONNECTING() {
    return Re.CONNECTING;
  }
  get OPEN() {
    return Re.OPEN;
  }
  get CLOSING() {
    return Re.CLOSING;
  }
  get CLOSED() {
    return Re.CLOSED;
  }
  get binaryType() {
    return this._ws ? this._ws.binaryType : this._binaryType;
  }
  set binaryType(e) {
    this._binaryType = e, this._ws && (this._ws.binaryType = e);
  }
  /**
   * Returns the number or connection retries
   */
  get retryCount() {
    return Math.max(this._retryCount, 0);
  }
  /**
   * The number of bytes of data that have been queued using calls to send() but not yet
   * transmitted to the network. This value resets to zero once all queued data has been sent.
   * This value does not reset to zero when the connection is closed; if you keep calling send(),
   * this will continue to climb. Read only
   */
  get bufferedAmount() {
    return this._messageQueue.reduce((e, n) => (typeof n == "string" ? e += n.length : n instanceof Blob ? e += n.size : e += n.byteLength, e), 0) + (this._ws ? this._ws.bufferedAmount : 0);
  }
  /**
   * The extensions selected by the server. This is currently only the empty string or a list of
   * extensions as negotiated by the connection
   */
  get extensions() {
    return this._ws ? this._ws.extensions : "";
  }
  /**
   * A string indicating the name of the sub-protocol the server selected;
   * this will be one of the strings specified in the protocols parameter when creating the
   * WebSocket object
   */
  get protocol() {
    return this._ws ? this._ws.protocol : "";
  }
  /**
   * The current state of the connection; this is one of the Ready state constants
   */
  get readyState() {
    return this._closeCalled ? Re.CLOSED : this._ws ? this._ws.readyState : this._options.startClosed ? Re.CLOSED : Re.CONNECTING;
  }
  /**
   * The URL as resolved by the constructor
   */
  get url() {
    return this._ws ? this._ws.url : "";
  }
  /**
   * Whether the websocket object is now in reconnectable state
   */
  get shouldReconnect() {
    return this._shouldReconnect;
  }
  /**
   * An event listener to be called when the WebSocket connection's readyState changes to CLOSED
   */
  onclose = null;
  /**
   * An event listener to be called when an error occurs
   */
  onerror = null;
  /**
   * An event listener to be called when a message is received from the server
   */
  onmessage = null;
  /**
   * An event listener to be called when the WebSocket connection's readyState changes to OPEN;
   * this indicates that the connection is ready to send and receive data
   */
  onopen = null;
  /**
   * Closes the WebSocket connection or connection attempt, if any. If the connection is already
   * CLOSED or CLOSING, this method does nothing.
   *
   * The `close` event is dispatched synchronously (mirroring how
   * `reconnect()` dispatches its synthetic close). This guarantees
   * consumers observe a terminal event for every explicit close, even
   * if their listeners are detached right after this call — previously
   * the real (asynchronous) browser close event could fire after
   * listeners were removed and go unobserved entirely.
   */
  close(e = 1e3, n) {
    if (this._closeCalled = !0, this._shouldReconnect = !1, this._clearTimeouts(), !this._ws) {
      this._debug("close enqueued: no ws instance");
      return;
    }
    if (this._ws.readyState === this.CLOSED || this._ws.readyState === this.CLOSING) {
      this._debug("close: already closing or closed");
      return;
    }
    this._disconnect(e, n);
  }
  /**
   * Closes the WebSocket connection or connection attempt and connects again.
   * Resets retry counter;
   */
  reconnect(e, n) {
    this._shouldReconnect = !0, this._closeCalled = !1, this._didWarnAboutClosedSend = !1, this._retryCount = -1, !this._ws || this._ws.readyState === this.CLOSED || this._ws.readyState === this.CLOSING ? this._connect() : (this._disconnect(e, n), this._connect());
  }
  /**
   * Enqueue specified data to be transmitted to the server over the WebSocket connection.
   *
   * @returns `true` if the message was transmitted immediately over an open
   * connection; `false` if it was buffered (sent when the connection next
   * opens — the buffer is always flushed before the `open` event is
   * dispatched) or dropped because `maxEnqueuedMessages` was reached.
   */
  send(e) {
    if (this._ws && this._ws.readyState === this.OPEN)
      return this._debug("send", e), this._ws.send(e), !0;
    this._closeCalled && !this._didWarnAboutClosedSend && (this._didWarnAboutClosedSend = !0, console.warn(
      "ReconnectingWebSocket: send() was called after close(). The message has been buffered, but it will only be delivered if reconnect() is called on this socket. If this socket has been discarded, the message is lost — this usually means a stale socket reference is being used."
    ));
    const { maxEnqueuedMessages: n = Xe.maxEnqueuedMessages } = this._options;
    return this._messageQueue.length < n && (this._debug("enqueue", e), this._messageQueue.push(e)), !1;
  }
  /**
   * Removes and returns all messages that were passed to send() but never
   * transmitted (they were buffered while the connection wasn't open).
   *
   * Useful when a socket is being discarded and replaced (e.g. the React
   * hooks recreate the socket when connection options change): the
   * replacement socket can re-send these messages, instead of them being
   * silently lost with the old instance.
   */
  drainQueuedMessages() {
    const e = this._messageQueue;
    return this._messageQueue = [], e;
  }
  _debug(...e) {
    this._options.debug && this._debugLogger("RWS>", ...e);
  }
  _getNextDelay() {
    const {
      reconnectionDelayGrowFactor: e = Xe.reconnectionDelayGrowFactor,
      minReconnectionDelay: n = Xe.minReconnectionDelay,
      maxReconnectionDelay: s = Xe.maxReconnectionDelay
    } = this._options;
    let r = 0;
    return this._retryCount > 0 && (r = n * e ** (this._retryCount - 1), r > s && (r = s)), this._debug("next delay", r), r;
  }
  _wait() {
    return new Promise((e) => {
      setTimeout(e, this._getNextDelay());
    });
  }
  _getNextProtocols(e) {
    if (!e) return Promise.resolve(null);
    if (typeof e == "string" || Array.isArray(e))
      return Promise.resolve(e);
    if (typeof e == "function") {
      const n = e();
      if (!n) return Promise.resolve(null);
      if (typeof n == "string" || Array.isArray(n))
        return Promise.resolve(n);
      if (n.then) return n;
    }
    throw Error("Invalid protocols");
  }
  _getNextUrl(e) {
    if (typeof e == "string") return Promise.resolve(e);
    if (typeof e == "function") {
      const n = e();
      if (typeof n == "string") return Promise.resolve(n);
      if (n.then) return n;
    }
    throw Error("Invalid URL");
  }
  _connect() {
    if (this._connectLock || !this._shouldReconnect) return;
    this._connectLock = !0;
    const {
      maxRetries: e = Xe.maxRetries,
      connectionTimeout: n = Xe.connectionTimeout
    } = this._options;
    if (this._retryCount >= e) {
      this._debug("max retries reached", this._retryCount, ">=", e), this._connectLock = !1;
      return;
    }
    this._retryCount++, this._debug("connect", this._retryCount), this._removeListeners(), this._wait().then(
      () => Promise.all([
        this._getNextUrl(this._url),
        this._getNextProtocols(this._protocols || null)
      ])
    ).then(([s, r]) => {
      if (this._closeCalled) {
        this._connectLock = !1;
        return;
      }
      !this._options.WebSocket && typeof WebSocket > "u" && !Mc && (console.error(`‼️ No WebSocket implementation available. You should define options.WebSocket. 

For example, if you're using node.js, run \`npm install ws\`, and then in your code:

import PartySocket from 'partysocket';
import WS from 'ws';

const partysocket = new PartySocket({
  host: "127.0.0.1:1999",
  room: "test-room",
  WebSocket: WS
});

`), Mc = !0);
      const i = this._options.WebSocket || WebSocket;
      this._debug("connect", {
        url: s,
        protocols: r
      }), this._ws = r ? new i(s, r) : new i(s), this._ws.binaryType = this._binaryType, this._connectLock = !1, this._addListeners(), this._connectTimeout = setTimeout(
        () => this._handleTimeout(),
        n
      );
    }).catch((s) => {
      this._connectLock = !1, this._handleError(new Ar.ErrorEvent(Error(s.message), this));
    });
  }
  _handleTimeout() {
    this._debug("timeout event"), this._handleError(new Ar.ErrorEvent(Error("TIMEOUT"), this));
  }
  _disconnect(e = 1e3, n) {
    if (this._clearTimeouts(), !!this._ws) {
      this._removeListeners();
      try {
        (this._ws.readyState === this.OPEN || this._ws.readyState === this.CONNECTING) && this._ws.close(e, n), this._handleClose(new Ar.CloseEvent(e, n, this));
      } catch {
      }
    }
  }
  _acceptOpen() {
    this._debug("accept open"), this._retryCount = 0;
  }
  _handleOpen = (e) => {
    this._debug("open event");
    const { minUptime: n = Xe.minUptime } = this._options;
    clearTimeout(this._connectTimeout), this._uptimeTimeout = setTimeout(() => this._acceptOpen(), n), Ky(this._ws, "WebSocket is not defined"), this._ws.binaryType = this._binaryType, this._messageQueue.forEach((s) => {
      this._ws?.send(s);
    }), this._messageQueue = [], this.onopen && this.onopen(e), this.dispatchEvent(ss(e));
  };
  _handleMessage = (e) => {
    this._debug("message event"), this.onmessage && this.onmessage(e), this.dispatchEvent(ss(e));
  };
  _handleError = (e) => {
    this._debug("error event", e.message), this._disconnect(void 0, e.message === "TIMEOUT" ? "timeout" : void 0), this.onerror && this.onerror(e), this._debug("exec error listeners"), this.dispatchEvent(ss(e)), this._connect();
  };
  _handleClose = (e) => {
    this._debug("close event"), this._clearTimeouts(), this._shouldReconnect && this._connect(), this.onclose && this.onclose(e), this.dispatchEvent(ss(e));
  };
  _removeListeners() {
    this._ws && (this._debug("removeListeners"), this._ws.removeEventListener("open", this._handleOpen), this._ws.removeEventListener("close", this._handleClose), this._ws.removeEventListener("message", this._handleMessage), this._ws.removeEventListener("error", this._handleError), this._ws.addEventListener("error", Jy));
  }
  _addListeners() {
    this._ws && (this._debug("addListeners"), this._ws.addEventListener("open", this._handleOpen), this._ws.addEventListener("close", this._handleClose), this._ws.addEventListener("message", this._handleMessage), this._ws.addEventListener("error", this._handleError));
  }
  _clearTimeouts() {
    clearTimeout(this._connectTimeout), clearTimeout(this._uptimeTimeout);
  }
};
const Zy = (t) => t[1] !== null && t[1] !== void 0;
function Qy() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  let t = Date.now(), e = performance?.now && performance.now() * 1e3 || 0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(n) {
    let s = Math.random() * 16;
    return t > 0 ? (s = (t + s) % 16 | 0, t = Math.floor(t / 16)) : (s = (e + s) % 16 | 0, e = Math.floor(e / 16)), (n === "x" ? s : s & 3 | 8).toString(16);
  });
}
function yu(t, e, n = {}) {
  const {
    host: s,
    path: r,
    protocol: i,
    room: o,
    party: c,
    basePath: a,
    prefix: l,
    query: u
  } = t;
  let h = s.replace(/^(http|https|ws|wss):\/\//, "");
  if (h.endsWith("/") && (h = h.slice(0, -1)), r?.startsWith("/"))
    throw new Error("path must not start with a slash");
  const d = c ?? "main", f = r ? `/${r}` : "", p = i || (h.startsWith("localhost:") || h.startsWith("127.0.0.1:") || h.startsWith("192.168.") || h.startsWith("10.") || h.startsWith("172.") && h.split(".")[1] >= "16" && h.split(".")[1] <= "31" || h.startsWith("[::ffff:7f00:1]:") ? e : `${e}s`), g = `${p}://${h}/${a || `${l || "parties"}/${d}/${o}`}${f}`, m = (C = {}) => `${g}?${new URLSearchParams([...Object.entries(n), ...Object.entries(C).filter(Zy)])}`, w = typeof u == "function" ? async () => m(await u()) : m(u);
  return {
    host: h,
    path: f,
    room: o,
    name: d,
    protocol: p,
    partyUrl: g,
    urlProvider: w
  };
}
var em = class extends Xy {
  _pk;
  _pkurl;
  name;
  room;
  host;
  path;
  basePath;
  constructor(t) {
    const e = $c(t);
    if (super(e.urlProvider, e.protocols, e.socketOptions), this.partySocketOptions = t, this.setWSProperties(e), !t.startClosed && !this.room && !this.basePath)
      throw this.close(), new Error(
        "Either room or basePath must be provided to connect. Use startClosed: true to create a socket and set them via updateProperties before calling reconnect()."
      );
    t.disableNameValidation || (t.party?.includes("/") && console.warn(
      `PartySocket: party name "${t.party}" contains forward slash which may cause routing issues. Consider using a name without forward slashes or set disableNameValidation: true to bypass this warning.`
    ), t.room?.includes("/") && console.warn(
      `PartySocket: room name "${t.room}" contains forward slash which may cause routing issues. Consider using a name without forward slashes or set disableNameValidation: true to bypass this warning.`
    ));
  }
  updateProperties(t) {
    const e = $c({
      ...this.partySocketOptions,
      ...t,
      host: t.host ?? this.host,
      room: t.room ?? this.room,
      path: t.path ?? this.path,
      basePath: t.basePath ?? this.basePath
    });
    this._url = e.urlProvider, this._protocols = e.protocols, this._options = e.socketOptions, this.setWSProperties(e);
  }
  setWSProperties(t) {
    const { _pk: e, _pkurl: n, name: s, room: r, host: i, path: o, basePath: c } = t;
    this._pk = e, this._pkurl = n, this.name = s, this.room = r, this.host = i, this.path = o, this.basePath = c;
  }
  reconnect(t, e) {
    if (!this.host)
      throw new Error(
        "The host must be set before connecting, use `updateProperties` method to set it or pass it to the constructor."
      );
    if (!this.room && !this.basePath)
      throw new Error(
        "The room (or basePath) must be set before connecting, use `updateProperties` method to set it or pass it to the constructor."
      );
    super.reconnect(t, e);
  }
  get id() {
    return this._pk;
  }
  /**
   * Exposes the static PartyKit room URL without applying query parameters.
   * To access the currently connected WebSocket url, use PartySocket#url.
   */
  get roomUrl() {
    return this._pkurl;
  }
  static async fetch(t, e) {
    const n = yu(t, "http"), s = typeof n.urlProvider == "string" ? n.urlProvider : await n.urlProvider();
    return (t.fetch ?? fetch)(s, e);
  }
};
function $c(t) {
  const {
    id: e,
    host: n,
    path: s,
    party: r,
    room: i,
    protocol: o,
    query: c,
    protocols: a,
    ...l
  } = t, u = e || Qy(), h = yu(t, "ws", { _pk: u });
  return {
    _pk: u,
    _pkurl: h.partyUrl,
    name: h.name,
    room: h.room,
    host: h.host,
    path: h.path,
    basePath: t.basePath,
    protocols: a,
    socketOptions: l,
    urlProvider: h.urlProvider
  };
}
const tm = 1e3;
function kr(t) {
  return t === Xl ? "identity" : Zl(t) ? "element" : Ql(t) ? "presence" : "cursor";
}
class nm {
  peers = /* @__PURE__ */ new Map();
  listeners = {
    cursor: /* @__PURE__ */ new Set(),
    element: /* @__PURE__ */ new Set(),
    presence: /* @__PURE__ */ new Set(),
    identity: /* @__PURE__ */ new Set()
  };
  unsubscribe;
  sweepTimer = null;
  constructor(e) {
    this.unsubscribe = e.subscribe((n) => this.handleMessage(n)), this.sweepTimer = setInterval(() => {
      this.sweepExpired(Date.now());
    }, tm);
  }
  /** The live folded peer map, keyed by connection id. Views read this. */
  getPeers() {
    return this.peers;
  }
  /**
   * Subscribe to a namespace. The callback fires whenever a message touched that
   * namespace, and once immediately with the current snapshot (replay). Returns
   * an unsubscribe function.
   */
  subscribe(e, n) {
    return this.listeners[e].add(n), ve(n, "peer store namespace"), () => {
      this.listeners[e].delete(n);
    };
  }
  destroy() {
    this.sweepTimer !== null && (clearInterval(this.sweepTimer), this.sweepTimer = null), this.unsubscribe();
    for (const e of Object.values(this.listeners)) e.clear();
  }
  handleMessage(e) {
    if (e.type === "presence-sync") {
      this.applySync(e.peers), this.pruneExpired(Date.now()), this.notify(/* @__PURE__ */ new Set(["cursor", "element", "presence", "identity"]));
      return;
    }
    if (e.type === "presence-changes") {
      const n = this.applyChanges(e);
      this.pruneExpired(Date.now(), n), n.size > 0 && this.notify(n);
    }
  }
  applySync(e) {
    this.peers.clear();
    for (const [n, s] of Object.entries(e))
      this.peers.set(n, { ...s });
  }
  applyChanges(e) {
    const n = /* @__PURE__ */ new Set();
    for (const [s, r] of Object.entries(e.updates)) {
      const i = this.peers.get(s) ?? {};
      this.peers.set(s, i);
      for (const [o, c] of Object.entries(r))
        i[o] = c, n.add(kr(o));
    }
    for (const [s, r] of Object.entries(e.removes)) {
      const i = this.peers.get(s);
      if (i) {
        for (const o of r)
          o in i && (delete i[o], n.add(kr(o)));
        Object.keys(i).length === 0 && this.peers.delete(s);
      }
    }
    return n;
  }
  notify(e) {
    const n = /* @__PURE__ */ new Set();
    for (const s of e)
      for (const r of this.listeners[s])
        n.has(r) || (n.add(r), ve(r, "peer store namespace"));
  }
  /** Periodic sweep for peers that went silent: prune expired channels and
   * notify only the namespaces that actually lost one (no-op when nothing
   * expired, so a quiet room never re-fires callbacks). */
  sweepExpired(e) {
    const n = /* @__PURE__ */ new Set();
    this.pruneExpired(e, n), n.size > 0 && this.notify(n);
  }
  /**
   * Delete every peer channel whose stamped `at` has aged past the staleness
   * window, recording the touched namespaces into `touched`. Never removes a
   * peer wholesale for having only unstamped channels (identity persists) —
   * only prunes a now-empty peer row. Unstamped channels (identity) are always
   * live, so they are never swept. This is the single implementation of
   * client-side staleness for cursor, element, and presence views.
   */
  pruneExpired(e, n = /* @__PURE__ */ new Set()) {
    for (const [s, r] of this.peers) {
      for (const [i, o] of Object.entries(r))
        Cy(o, e, Xs) || (delete r[i], n.add(kr(i)));
      Object.keys(r).length === 0 && this.peers.delete(s);
    }
    return n;
  }
}
const sm = 1, rm = 3, im = 15e3, om = 5e3;
class mu {
  socket;
  room;
  listeners = /* @__PURE__ */ new Set();
  latestJoin = null;
  channelValues = /* @__PURE__ */ new Map();
  // One peer-folding layer per socket, shared by every consumer (cursors,
  // element awareness, page presence). It subscribes to this transport's raw
  // message stream and exposes per-namespace subscriptions + the folded peers.
  peers;
  // Observability state (see PresenceConnectionState). Internal, for tests/debug.
  _connectionState = "connecting";
  hasEverOpened = !1;
  failedReconnects = 0;
  unreachableLogged = !1;
  unreachableTimer = null;
  lastControlLogAt = /* @__PURE__ */ new Map();
  usesHandlerProperties = !1;
  onMessage = (e) => {
    const n = cm(e.data);
    if (n) {
      this.handleControlMessage(n);
      for (const s of this.listeners)
        ve(() => s(n), "presence transport listener");
    }
  };
  onOpen = () => {
    this._connectionState = "open", this.hasEverOpened = !0, this.failedReconnects = 0, this.unreachableLogged = !1, this.unreachableTimer !== null && (clearTimeout(this.unreachableTimer), this.unreachableTimer = null), this.flushCurrentState();
  };
  onCloseOrError = () => {
    this._connectionState !== "open" && (this.failedReconnects += 1), this._connectionState !== "unreachable" && (this._connectionState = "connecting"), this.failedReconnects >= rm && this.markUnreachable();
  };
  constructor(e) {
    this.room = e.room;
    const n = e.socketFactory ?? ((s) => new em(s));
    this.socket = n({
      host: e.host,
      room: e.room,
      party: "presence",
      maxEnqueuedMessages: 0
    }), Oc(this.socket) ? (this.socket.onmessage = this.onMessage, this.socket.onopen = this.onOpen, this.socket.onclose = this.onCloseOrError, this.socket.onerror = this.onCloseOrError, this.usesHandlerProperties = !0) : (this.socket.addEventListener("message", this.onMessage), this.socket.addEventListener("open", this.onOpen), this.socket.addEventListener("close", this.onCloseOrError), this.socket.addEventListener("error", this.onCloseOrError)), this.unreachableTimer = setTimeout(() => {
      this.unreachableTimer = null, this.hasEverOpened || this.markUnreachable();
    }, im), this.peers = new nm(this);
  }
  /** Observability flag: whether the realtime socket is connecting, open, or
   * has been declared unreachable. Never gates behavior — for tests/debugging. */
  get connectionState() {
    return this._connectionState;
  }
  markUnreachable() {
    this.unreachableLogged || (this.unreachableLogged = !0, this._connectionState = "unreachable", console.error(
      `[playhtml] presence transport unreachable — realtime presence degraded (room ${this.room}). Cursors, element awareness, and custom presence will not sync until the connection recovers.`
    ));
  }
  /**
   * Base handling of server control messages, on EVERY socket (not just the
   * cursor client's). Consumers still layer their own reactions (e.g. the cursor
   * client's hz pacing) via subscribe(); this only guarantees rejections, the
   * channel cap, and force-close loops are never fully silent. Logging is
   * rate-limited per event type so a loop can't spam the console.
   */
  handleControlMessage(e) {
    e.type === "presence-error" ? this.logControl(
      "presence-error",
      () => console.warn(
        `[playhtml] presence server rejected a message (room ${this.room}):`,
        e.message
      )
    ) : e.type === "presence-rate" && this.logControl(
      "presence-rate",
      () => console.warn(
        `[playhtml] presence channel "${e.channel}" is rate-limited to ${e.hz}Hz (room ${this.room}).`
      )
    );
  }
  logControl(e, n) {
    const s = Date.now(), r = this.lastControlLogAt.get(e) ?? 0;
    s - r < om || (this.lastControlLogAt.set(e, s), n());
  }
  join(e) {
    const n = We(e), s = {
      type: "presence-join",
      identity: n.identity,
      page: n.page
    };
    gr(s), this.latestJoin = n, this.sendIfOpen(s);
  }
  update(e, n) {
    const s = We(n), r = {
      type: "presence-update",
      channel: e,
      value: s
    };
    gr(r), this.channelValues.set(e, s), this.sendIfOpen(r);
  }
  clear(e) {
    this.channelValues.delete(e), this.sendIfOpen({
      type: "presence-clear",
      channel: e
    });
  }
  subscribe(e) {
    return this.listeners.add(e), () => {
      this.listeners.delete(e);
    };
  }
  destroy() {
    this.unreachableTimer !== null && (clearTimeout(this.unreachableTimer), this.unreachableTimer = null), this.peers.destroy(), this.usesHandlerProperties && Oc(this.socket) ? (this.socket.onmessage === this.onMessage && (this.socket.onmessage = null), this.socket.onopen === this.onOpen && (this.socket.onopen = null), this.socket.onclose === this.onCloseOrError && (this.socket.onclose = null), this.socket.onerror === this.onCloseOrError && (this.socket.onerror = null)) : (this.socket.removeEventListener(
      "message",
      this.onMessage
    ), this.socket.removeEventListener("open", this.onOpen), this.socket.removeEventListener("close", this.onCloseOrError), this.socket.removeEventListener("error", this.onCloseOrError)), this.socket.close(), this.listeners.clear();
  }
  flushCurrentState() {
    this.latestJoin && this.sendIfOpen({
      type: "presence-join",
      identity: this.latestJoin.identity,
      page: this.latestJoin.page
    });
    for (const [e, n] of this.channelValues)
      this.sendIfOpen({
        type: "presence-update",
        channel: e,
        value: n
      });
  }
  sendIfOpen(e) {
    gr(e), this.isSocketOpen() && this.socket.send(JSON.stringify(e));
  }
  isSocketOpen() {
    return this.socket.readyState === void 0 || this.socket.readyState === sm;
  }
}
function wu() {
  return typeof WebSocket < "u";
}
function Oc(t) {
  return "onmessage" in t && "onopen" in t && "onclose" in t && "onerror" in t;
}
function cm(t) {
  if (typeof t != "string") return null;
  let e;
  try {
    e = JSON.parse(t);
  } catch {
    return null;
  }
  if (!z(e)) return null;
  switch (e.type) {
    case "presence-sync":
      return Ac(e.peers) ? e : null;
    case "presence-changes":
      return Ac(e.updates) && _y(e.removes) ? e : null;
    case "presence-rate":
      return typeof e.channel == "string" && typeof e.hz == "number" ? e : null;
    case "presence-error":
      return typeof e.message == "string" ? e : null;
    default:
      return null;
  }
}
const Pc = `${Yi}shard:`, bu = 1, Jt = 8, am = 1100;
class lm {
  transport;
  getIdentity;
  getPage;
  onAwareness;
  localTags = /* @__PURE__ */ new Map();
  publishedChannels = /* @__PURE__ */ new Set();
  // Shard channels whose clear may not have reached the server yet. A dropped
  // clear is otherwise permanent: publishedChannels is updated immediately, so a
  // later publish wouldn't re-issue it. Held until a trailing republish re-sends.
  pendingClears = /* @__PURE__ */ new Set();
  unsubscribe;
  stopKeepalive;
  publishScheduled = !1;
  republishTimer = null;
  destroyed = !1;
  lastAwarenessFingerprint = "";
  constructor(e) {
    this.transport = e.transport, this.getIdentity = e.getIdentity, this.getPage = e.getPage, this.onAwareness = e.onAwareness;
    const n = () => this.emit(), s = this.transport.peers.subscribe("element", n), r = this.transport.peers.subscribe("identity", n);
    this.unsubscribe = () => {
      s(), r();
    }, this.stopKeepalive = eu(() => {
      this.destroyed || this.localTags.size === 0 || this.publishLocalAwareness();
    }), this.join();
  }
  setLocalAwareness(e, n, s) {
    this.stageLocalAwareness(e, n, s) && (this.schedulePublish(), this.emit());
  }
  /**
   * Sets many elements' awareness at once, coalescing into a single publish and
   * a single local emit. Used to reseed retained handlers after a room change
   * without triggering one full-shard publish per element.
   */
  setLocalAwarenessBatch(e) {
    let n = !1;
    for (const [s, r, i] of e)
      this.stageLocalAwareness(s, r, i) && (n = !0);
    n && (this.schedulePublish(), this.emit());
  }
  /** Stages a local write into localTags; returns true if it changed. */
  stageLocalAwareness(e, n, s) {
    const r = this.localTags.get(e) ?? {};
    return r[n] === s ? !1 : (this.localTags.set(e, { ...r, [n]: s }), !0);
  }
  removeLocalAwareness(e, n) {
    const s = this.localTags.get(e);
    if (!s || !(n in s)) return;
    const r = { ...s };
    delete r[n], Object.keys(r).length === 0 ? this.localTags.delete(e) : this.localTags.set(e, r), this.schedulePublish(), this.emit();
  }
  getLocalAwareness(e, n) {
    return this.localTags.get(e)?.[n];
  }
  refresh() {
    this.emit();
  }
  destroy() {
    this.destroyed = !0, this.republishTimer !== null && (clearTimeout(this.republishTimer), this.republishTimer = null), this.stopKeepalive(), this.unsubscribe();
  }
  /**
   * Coalesce publishes: multiple local writes in one tick collapse into a single
   * shard-set publish on the next microtask. Bursts (e.g. every element on a
   * heavy page initializing at once) thus cost one publish, not O(N).
   */
  schedulePublish() {
    this.publishScheduled || this.destroyed || (this.publishScheduled = !0, queueMicrotask(() => {
      this.publishScheduled = !1, !this.destroyed && (this.publishLocalAwareness(), this.scheduleRepublish());
    }));
  }
  /**
   * After a publish, re-send the latest snapshot once things quiet down. The
   * server drops updates past its per-connection budget under a burst and never
   * tells us which; a single trailing re-publish re-sends whatever was dropped.
   */
  scheduleRepublish() {
    this.destroyed || (this.republishTimer !== null && clearTimeout(this.republishTimer), this.republishTimer = setTimeout(() => {
      if (this.republishTimer = null, !this.destroyed) {
        for (const e of this.pendingClears)
          Ls(this.transport, e, "element awareness");
        this.pendingClears.clear(), this.publishLocalAwareness();
      }
    }, am));
  }
  join() {
    try {
      this.transport.join({
        identity: this.getIdentity(),
        page: this.getPage()
      });
    } catch (e) {
      console.warn("[playhtml] Failed to join element awareness room:", e);
    }
  }
  publishLocalAwareness() {
    const e = /* @__PURE__ */ new Set(), n = hm(this.localTags), s = n.slice(0, Jt);
    if (n.length > Jt) {
      const r = fm(
        n.slice(Jt)
      );
      console.error(
        `[playhtml] Element awareness exceeded ${Jt} shards (~${Jt * As} bytes); dropping overflow so under-budget elements keep syncing. Affected tags: ${r.join(", ")}.`
      );
    }
    for (let r = 0; r < s.length; r += 1) {
      const i = `${Pc}${r}`;
      su(
        this.transport,
        i,
        // Each shard already carries an `at` stamp (createElementPresenceShard)
        // so it ages out client-side if this peer disconnects ungracefully.
        s[r],
        "element awareness"
      ) && e.add(i), this.pendingClears.delete(i);
    }
    for (const r of this.publishedChannels)
      e.has(r) || (this.pendingClears.add(r), Ls(this.transport, r, "element awareness"));
    this.publishedChannels = e;
  }
  emit() {
    const e = this.buildElementAwareness(), n = um(e);
    n !== this.lastAwarenessFingerprint && (this.lastAwarenessFingerprint = n, this.onAwareness(e));
  }
  buildElementAwareness() {
    const e = /* @__PURE__ */ new Map(), n = this.getIdentity().publicKey;
    for (const [r, i] of this.localTags)
      for (const [o, c] of Object.entries(i))
        Zr(e, r, o, c, n);
    const s = this.transport.peers.getPeers();
    for (const r of Array.from(s.keys()).sort()) {
      const i = s.get(r), o = nu(i);
      if (o === n) continue;
      const c = o ?? r;
      for (const [a, l] of Object.entries(i))
        if (Zl(a)) {
          if (a.startsWith(Pc))
            pm(e, l, c);
          else if (z(l)) {
            const u = a.slice(Yi.length);
            for (const [h, d] of Object.entries(l))
              Zr(e, u, h, d, c);
          }
        }
    }
    return e;
  }
}
function um(t) {
  const e = [];
  for (const n of Array.from(t.keys()).sort()) {
    const s = t.get(n);
    for (const r of Array.from(s.byStableId.keys()).sort()) {
      let i;
      try {
        i = JSON.stringify(s.byStableId.get(r)) ?? "null";
      } catch {
        i = "null";
      }
      e.push(`${n}:${r}:${i}`);
    }
  }
  return e.join("|");
}
function Zr(t, e, n, s, r) {
  const i = `${e}:${n}`;
  let o = t.get(i);
  o || (o = { array: [], byStableId: /* @__PURE__ */ new Map() }, t.set(i, o)), o.array.push(s), o.byStableId.set(r, s);
}
function hm(t) {
  const e = [];
  let n = [];
  for (const s of dm(t)) {
    const r = [...n, s];
    n.length > 0 && tu(xr(r)) > As ? (e.push(xr(n)), n = [s]) : n = r;
  }
  return n.length > 0 && e.push(xr(n)), e;
}
function dm(t) {
  const e = [];
  for (const n of Array.from(t.keys()).sort()) {
    const s = t.get(n);
    for (const r of Object.keys(s).sort())
      e.push([n, r, s[r]]);
  }
  return e;
}
function xr(t) {
  return {
    v: bu,
    // Stamp the publish time here (not at send) so shard sizing accounts for the
    // `at` field and a near-4KB shard can't tip over the cap once stamped. The
    // exact value doesn't affect byte length (always a ~13-digit epoch ms).
    at: Date.now(),
    entries: t
  };
}
function fm(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t)
    for (const [s] of n.entries) e.add(s);
  return Array.from(e).sort();
}
function pm(t, e, n) {
  if (gm(e))
    for (const s of e.entries) {
      const [r, i, o] = s;
      Zr(t, r, i, o, n);
    }
}
function gm(t) {
  return !z(t) || t.v !== bu || !Array.isArray(t.entries) ? !1 : t.entries.every(
    (e) => Array.isArray(e) && e.length === 3 && typeof e[0] == "string" && typeof e[1] == "string"
  );
}
const ym = 1100;
class vu {
  transport;
  getIdentity;
  getPage;
  getCursorPresences;
  onCursorPresencesChange;
  localChannels = /* @__PURE__ */ new Map();
  // Wire channels whose clear may not have reached the server yet (a dropped
  // clear is otherwise permanent: localChannels no longer holds the value, so
  // the trailing republish wouldn't re-send it). Cleared channels are held here
  // until a trailing republish re-issues the clear.
  pendingClears = /* @__PURE__ */ new Set();
  listeners = /* @__PURE__ */ new Map();
  nextListenerId = 0;
  unsubscribe;
  stopKeepalive;
  republishTimer = null;
  destroyed = !1;
  constructor(e) {
    this.transport = e.transport, this.getIdentity = e.getIdentity, this.getPage = e.getPage, this.getCursorPresences = e.getCursorPresences, this.onCursorPresencesChange = e.onCursorPresencesChange;
    const n = () => this.emit(), s = this.transport.peers.subscribe("presence", n), r = this.transport.peers.subscribe("identity", n);
    this.unsubscribe = () => {
      s(), r();
    }, this.stopKeepalive = eu(() => {
      this.destroyed || this.localChannels.size === 0 || this.republishLiveChannels();
    }), this.join();
  }
  setMyPresence(e, n) {
    if (vr(e))
      throw new Error(
        `[playhtml] "${e}" is a reserved presence field and cannot be used as a channel name. playerIdentity, cursor, and isMe are populated by playhtml; choose a different channel name.`
      );
    const s = Cr(e);
    if (n == null) {
      if (!this.localChannels.has(e) && this.pendingClears.has(s))
        return;
      this.localChannels.delete(e), this.pendingClears.add(s), Ls(this.transport, s, "presence");
    } else
      this.localChannels.set(e, n), this.pendingClears.delete(s), this.publishChannel(e, n);
    this.scheduleRepublish(), this.emit();
  }
  /** Publish a live channel wrapped in the staleness envelope ({at, value}). */
  publishChannel(e, n) {
    su(
      this.transport,
      Cr(e),
      Sy(n),
      "presence"
    );
  }
  getPresences() {
    return this.buildPresences();
  }
  onPresenceChange(e, n) {
    if (e === "cursor" && this.onCursorPresencesChange) {
      const r = this.onCursorPresencesChange(() => {
        n(this.buildPresences());
      });
      return ve(() => n(this.buildPresences()), "presence subscriber"), r ?? (() => {
      });
    }
    const s = String(this.nextListenerId++);
    return this.listeners.set(s, {
      channel: e,
      callback: n,
      lastFingerprint: this.channelFingerprint(e)
    }), ve(() => n(this.buildPresences()), "presence subscriber"), () => {
      this.listeners.delete(s);
    };
  }
  getMyIdentity() {
    return this.getIdentity();
  }
  destroy() {
    this.destroyed = !0, this.republishTimer !== null && (clearTimeout(this.republishTimer), this.republishTimer = null), this.stopKeepalive(), this.unsubscribe();
  }
  /**
   * After a publish burst settles, re-send the latest value of every live
   * channel once, recovering anything the server dropped over its rate budget.
   */
  scheduleRepublish() {
    this.destroyed || (this.republishTimer !== null && clearTimeout(this.republishTimer), this.republishTimer = setTimeout(() => {
      if (this.republishTimer = null, !this.destroyed) {
        this.republishLiveChannels();
        for (const e of this.pendingClears)
          Ls(this.transport, e, "presence");
        this.pendingClears.clear();
      }
    }, ym));
  }
  /** Re-send every live channel with a fresh timestamp. Shared by the burst
   * recovery (scheduleRepublish) and the keepalive re-stamp. */
  republishLiveChannels() {
    for (const [e, n] of this.localChannels)
      this.publishChannel(e, n);
  }
  join() {
    try {
      this.transport.join({
        identity: this.getIdentity(),
        page: this.getPage()
      });
    } catch (e) {
      console.warn("[playhtml] Failed to join presence room:", e);
    }
  }
  /** The shared PeerStore's folded peer map. Views read all channels and filter
   * to the presence + identity namespaces they care about. */
  get peers() {
    return this.transport.peers.getPeers();
  }
  emit() {
    if (this.listeners.size === 0) return;
    let e = null;
    const n = () => (e || (e = this.buildPresences()), e);
    for (const s of this.listeners.values()) {
      const r = this.channelFingerprint(s.channel);
      if (r === s.lastFingerprint) continue;
      ve(
        () => s.callback(n()),
        "presence subscriber"
      ) && (s.lastFingerprint = r);
    }
  }
  /** Fingerprint of one channel across self + all remote peers, so a listener
   * only fires when its channel actually changed. Fingerprints the UNWRAPPED
   * payload so a keepalive re-stamp (which only bumps the envelope `at`) does
   * not count as a change and re-fire subscribers. */
  channelFingerprint(e) {
    const n = [];
    this.localChannels.has(e) && n.push(`self:${Rc(this.localChannels.get(e))}`);
    const s = Cr(e);
    for (const r of Array.from(this.peers.keys()).sort()) {
      const i = this.peers.get(r)?.[s];
      i !== void 0 && n.push(`${r}:${Rc(_c(i))}`);
    }
    return n.join("|");
  }
  buildPresences() {
    const e = /* @__PURE__ */ new Map(), n = this.getIdentity().publicKey;
    e.set(n, this.buildSelfView());
    for (const s of Array.from(this.peers.keys()).sort()) {
      const r = this.peers.get(s), i = r.identity, o = nu(r);
      if (o === n) continue;
      const c = o ?? s, a = e.get(c) ?? {
        playerIdentity: z(i) ? i : void 0,
        cursor: null,
        isMe: !1
      };
      !a.playerIdentity && z(i) && (a.playerIdentity = i);
      for (const [l, u] of Object.entries(r)) {
        if (!Ql(l)) continue;
        const h = wy(l);
        vr(h) || (a[h] = _c(u));
      }
      e.set(c, a);
    }
    return this.mergeCursorPresences(e, n), e;
  }
  buildSelfView() {
    const e = {
      playerIdentity: this.getIdentity(),
      cursor: null,
      isMe: !0
    };
    for (const [n, s] of this.localChannels)
      vr(n) || (e[n] = s);
    return e;
  }
  mergeCursorPresences(e, n) {
    const s = this.getCursorPresences?.();
    if (s)
      for (const [r, i] of s) {
        const o = e.get(r);
        e.set(r, {
          ...o,
          playerIdentity: i.playerIdentity ?? o?.playerIdentity,
          cursor: i.cursor ?? null,
          isMe: r === n
        });
      }
  }
}
function Rc(t) {
  try {
    return JSON.stringify(t ?? null);
  } catch {
    return "null";
  }
}
class mm {
  inner;
  subscriptions = /* @__PURE__ */ new Map();
  nextSubscriptionId = 0;
  constructor(e) {
    this.inner = e;
  }
  /** Swap the delegate, re-attaching every active subscription to it. */
  setInner(e) {
    if (e !== this.inner) {
      this.inner = e;
      for (const n of this.subscriptions.values()) {
        try {
          n.innerUnsub();
        } catch {
        }
        let s = () => {
        };
        ve(() => {
          s = e.onPresenceChange(
            n.channel,
            n.callback
          );
        }, "presence facade re-attach"), n.innerUnsub = s;
      }
    }
  }
  setMyPresence(e, n) {
    this.inner.setMyPresence(e, n);
  }
  getPresences() {
    return this.inner.getPresences();
  }
  onPresenceChange(e, n) {
    const s = this.nextSubscriptionId++, r = this.inner.onPresenceChange(e, n);
    return this.subscriptions.set(s, { channel: e, callback: n, innerUnsub: r }), () => {
      const i = this.subscriptions.get(s);
      if (i) {
        this.subscriptions.delete(s);
        try {
          i.innerUnsub();
        } catch {
        }
      }
    };
  }
  getMyIdentity() {
    return this.inner.getMyIdentity();
  }
}
class wm {
  pendingChanges = [];
  cancelFlush = null;
  getDoc;
  constructor(e) {
    this.getDoc = e;
  }
  queue(e) {
    this.pendingChanges.push({ targetDoc: this.getDoc(), apply: e }), this.requestFlush();
  }
  clear() {
    this.cancelFlush && (this.cancelFlush(), this.cancelFlush = null), this.pendingChanges = [];
  }
  flush() {
    this.cancelFlush = null;
    const e = this.pendingChanges;
    if (this.pendingChanges = [], !e.length)
      return;
    const n = /* @__PURE__ */ new Map();
    for (const s of e) {
      const r = n.get(s.targetDoc) ?? [];
      r.push(s.apply), n.set(s.targetDoc, r);
    }
    for (const [s, r] of n)
      s.transact(() => {
        for (const i of r)
          i();
      });
  }
  requestFlush() {
    if (this.cancelFlush)
      return;
    const e = () => this.flush();
    if (typeof window.requestAnimationFrame == "function") {
      const s = window.requestAnimationFrame(e);
      this.cancelFlush = () => window.cancelAnimationFrame(s);
      return;
    }
    const n = window.setTimeout(e, 0);
    this.cancelFlush = () => window.clearTimeout(n);
  }
}
const qi = { ATTRIBUTE: 1, CHILD: 2 }, Ji = (t) => (...e) => ({ _$litDirective$: t, values: e });
let Xi = class {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, n, s) {
    this._$Ct = e, this._$AM = n, this._$Ci = s;
  }
  _$AS(e, n) {
    return this.update(e, n);
  }
  update(e, n) {
    return this.render(...n);
  }
};
const { I: bm } = ny, Nc = (t) => t, Uc = () => document.createComment(""), Xt = (t, e, n) => {
  const s = t._$AA.parentNode, r = e === void 0 ? t._$AB : e._$AA;
  if (n === void 0) {
    const i = s.insertBefore(Uc(), r), o = s.insertBefore(Uc(), r);
    n = new bm(i, o, t, t.options);
  } else {
    const i = n._$AB.nextSibling, o = n._$AM, c = o !== t;
    if (c) {
      let a;
      n._$AQ?.(t), n._$AM = t, n._$AP !== void 0 && (a = t._$AU) !== o._$AU && n._$AP(a);
    }
    if (i !== r || c) {
      let a = n._$AA;
      for (; a !== i; ) {
        const l = Nc(a).nextSibling;
        Nc(s).insertBefore(a, r), a = l;
      }
    }
  }
  return n;
}, Ze = (t, e, n = t) => (t._$AI(e, n), t), vm = {}, Cm = (t, e = vm) => t._$AH = e, Sm = (t) => t._$AH, Dr = (t) => {
  t._$AR(), t._$AA.remove();
};
const Fc = (t, e, n) => {
  const s = /* @__PURE__ */ new Map();
  for (let r = e; r <= n; r++) s.set(t[r], r);
  return s;
}, y0 = Ji(class extends Xi {
  constructor(t) {
    if (super(t), t.type !== qi.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(t, e, n) {
    let s;
    n === void 0 ? n = e : e !== void 0 && (s = e);
    const r = [], i = [];
    let o = 0;
    for (const c of t) r[o] = s ? s(c, o) : o, i[o] = n(c, o), o++;
    return { values: i, keys: r };
  }
  render(t, e, n) {
    return this.dt(t, e, n).values;
  }
  update(t, [e, n, s]) {
    const r = Sm(t), { values: i, keys: o } = this.dt(e, n, s);
    if (!Array.isArray(r)) return this.ut = o, i;
    const c = this.ut ??= [], a = [];
    let l, u, h = 0, d = r.length - 1, f = 0, p = i.length - 1;
    for (; h <= d && f <= p; ) if (r[h] === null) h++;
    else if (r[d] === null) d--;
    else if (c[h] === o[f]) a[f] = Ze(r[h], i[f]), h++, f++;
    else if (c[d] === o[p]) a[p] = Ze(r[d], i[p]), d--, p--;
    else if (c[h] === o[p]) a[p] = Ze(r[h], i[p]), Xt(t, a[p + 1], r[h]), h++, p--;
    else if (c[d] === o[f]) a[f] = Ze(r[d], i[f]), Xt(t, r[h], r[d]), d--, f++;
    else if (l === void 0 && (l = Fc(o, f, p), u = Fc(c, h, d)), l.has(c[h])) if (l.has(c[d])) {
      const g = u.get(o[f]), m = g !== void 0 ? r[g] : null;
      if (m === null) {
        const w = Xt(t, r[h]);
        Ze(w, i[f]), a[f] = w;
      } else a[f] = Ze(m, i[f]), Xt(t, r[h], m), r[g] = null;
      f++;
    } else Dr(r[d]), d--;
    else Dr(r[h]), h++;
    for (; f <= p; ) {
      const g = Xt(t, a[p + 1]);
      Ze(g, i[f]), a[f++] = g;
    }
    for (; h <= d; ) {
      const g = r[h++];
      g !== null && Dr(g);
    }
    return this.ut = o, Cm(t, a), Ye;
  }
});
const m0 = Ji(class extends Xi {
  constructor(t) {
    if (super(t), t.type !== qi.ATTRIBUTE || t.name !== "class" || t.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(t) {
    return " " + Object.keys(t).filter((e) => t[e]).join(" ") + " ";
  }
  update(t, [e]) {
    if (this.st === void 0) {
      this.st = /* @__PURE__ */ new Set(), t.strings !== void 0 && (this.nt = new Set(t.strings.join(" ").split(/\s/).filter((s) => s !== "")));
      for (const s in e) e[s] && !this.nt?.has(s) && this.st.add(s);
      return this.render(e);
    }
    const n = t.element.classList;
    for (const s of this.st) s in e || (n.remove(s), this.st.delete(s));
    for (const s in e) {
      const r = !!e[s];
      r === this.st.has(s) || this.nt?.has(s) || (r ? (n.add(s), this.st.add(s)) : (n.remove(s), this.st.delete(s)));
    }
    return Ye;
  }
});
const Cu = "important", Em = " !" + Cu, w0 = Ji(class extends Xi {
  constructor(t) {
    if (super(t), t.type !== qi.ATTRIBUTE || t.name !== "style" || t.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(t) {
    return Object.keys(t).reduce((e, n) => {
      const s = t[n];
      return s == null ? e : e + `${n = n.includes("-") ? n : n.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s};`;
    }, "");
  }
  update(t, [e]) {
    const { style: n } = t.element;
    if (this.ft === void 0) return this.ft = new Set(Object.keys(e)), this.render(e);
    for (const s of this.ft) e[s] == null && (this.ft.delete(s), s.includes("-") ? n.removeProperty(s) : n[s] = null);
    for (const s in e) {
      const r = e[s];
      if (r != null) {
        this.ft.add(s);
        const i = typeof r == "string" && r.endsWith(Em);
        s.includes("-") || i ? n.setProperty(s, i ? r.slice(0, -11) : r, i ? Cu : "") : n[s] = r;
      }
    }
    return Ye;
  }
}), _m = "api.playhtml.fun", Am = "api-staging.playhtml.fun";
function km(t) {
  if (t)
    return t;
  const e = window.location.hostname;
  return e.includes("staging") || e.includes("ngrok-free") ? Am : _m;
}
let ne = Vl({ play: {} }), mt = Bl(ne), Su = fu(ne.play), Qr = null;
function Eu({ includeSearch: t }) {
  const e = window.location.pathname.replace(/\.[^/.]+$/, "");
  return t ? e + window.location.search : e;
}
function rs(t) {
  return t.replace(/\.[^/.]+$/, "");
}
function _u(t) {
  const e = {
    domain: window.location.host,
    pathname: window.location.pathname,
    search: window.location.search
  };
  if (typeof t == "function") {
    const n = t(e);
    return n && n.startsWith("/") ? rs(n) : n;
  }
  switch (t) {
    case "page":
      return rs(e.pathname);
    case "domain":
      return "";
    case "section":
      return `/${rs(e.pathname).split("/").filter(Boolean)[0] || ""}`;
    default:
      return rs(e.pathname);
  }
}
function An(t, e) {
  const n = "ottv2-lan", s = e === "" ? n : `${n}-${e}`;
  return encodeURIComponent(s);
}
let H, Lt = null, se = null, Qe = "", kn = null, Q = null;
const st = {
  subscribers: /* @__PURE__ */ new Set(),
  feedUnsub: null,
  getPresences() {
    return se?.getCursorPresences() ?? /* @__PURE__ */ new Map();
  },
  subscribe(t) {
    return this.subscribers.add(t), () => {
      this.subscribers.delete(t);
    };
  },
  notify(t) {
    for (const e of this.subscribers)
      ve(() => e(t), "cursor presence subscriber");
  },
  // Point the hub at a freshly built cursor client: drop the previous feed and
  // forward the new client's presence changes to hub subscribers.
  connect(t) {
    this.feedUnsub?.(), this.feedUnsub = t.onCursorPresencesChange((e) => {
      this.notify(e);
    });
  },
  disconnect() {
    this.feedUnsub?.(), this.feedUnsub = null;
  }
};
function Te() {
  return Q?.getIdentity() ?? ly();
}
const Be = /* @__PURE__ */ new Map(), Ge = /* @__PURE__ */ new Map(), Au = /* @__PURE__ */ new Map(), ku = /* @__PURE__ */ new Map(), Is = /* @__PURE__ */ new Set(), lt = /* @__PURE__ */ new Map(), ei = /* @__PURE__ */ new Set();
function xm(t) {
  const e = t.getAttribute("data-source");
  if (!e) return;
  let n, s, r;
  try {
    ({ domain: n, path: s, elementId: r } = Tl(e));
  } catch {
    return;
  }
  const i = `${n}${s}#${r}`;
  if (!ei.has(i) && (ei.add(i), H?.wsconnected))
    try {
      const o = { domain: n, path: s, elementId: r };
      H.sendMessage(
        JSON.stringify({
          type: "add-shared-reference",
          reference: o
        })
      ), H.sendMessage(
        JSON.stringify({
          type: "export-permissions",
          elementIds: [r]
        })
      );
    } catch (o) {
      console.warn(
        "[PLAYHTML] Failed to notify server of new shared reference:",
        o
      );
    }
}
function Dm(t) {
  if (!t.id) return;
  const e = t.id, n = t.getAttribute("shared");
  let s = "read-write";
  if (n && n !== "") {
    const r = n.toLowerCase();
    (r.includes("read-only") || r === "ro") && (s = "read-only");
  }
  if (lu(e, s), H?.wsconnected)
    try {
      const r = {
        elementId: e,
        permissions: s,
        path: window.location.pathname
      };
      H.sendMessage(
        JSON.stringify({
          type: "register-shared-element",
          element: r
        })
      );
    } catch (r) {
      console.warn(
        "[PLAYHTML] Failed to notify server of new shared element:",
        r
      );
    }
}
function xu(t, e, n) {
  Be.has(t) || Be.set(t, /* @__PURE__ */ new Map());
  const s = Be.get(t);
  if (!s.has(e)) {
    ne.play[t] ??= {};
    const r = ne.play[t];
    if (r[e] === void 0) {
      const i = We(n);
      r[e] = i;
    }
    s.set(e, r[e]);
  }
  return s.get(e);
}
const M = /* @__PURE__ */ new Map(), jc = /* @__PURE__ */ new WeakMap();
let Ft = /* @__PURE__ */ new Map();
const Hc = /* @__PURE__ */ new Set(), Zi = new wm(() => mt), zc = /* @__PURE__ */ new Map();
let Tm = 0, Hn = Il;
function wt() {
  return [Z.CanPlay, ...Object.keys(Hn)];
}
function Lm(t) {
  H.sendMessage(JSON.stringify(t));
}
function Qi(t) {
  let e;
  try {
    e = JSON.parse(t);
  } catch {
    return;
  }
  if (e.type === "room-reset") {
    const i = Number(e.resetEpoch);
    if (!Number.isFinite(i)) {
      console.error("[PLAYHTML] Received room-reset without a resetEpoch"), window.location.reload();
      return;
    }
    Fm(i);
    return;
  }
  const { type: n, eventPayload: s } = e, r = Ft.get(n);
  if (!r) {
    if (e.permissions)
      try {
        const i = e.permissions;
        Object.entries(i).forEach(([o, c]) => {
          if (lu(o, c), c === "read-only") {
            const a = document.querySelector(
              `[data-source$="#${CSS.escape(o)}"]`
            );
            a && a.setAttribute("data-source-read-only", "");
          }
        });
      } catch {
      }
    return;
  }
  for (const i of r)
    i.onEvent(s);
}
let q = !1, xn = !0, Zs = !0, kt = !1, Du = () => {
}, ti = () => {
};
function Tu() {
  const t = new Promise((e, n) => {
    Du = e, ti = n;
  });
  return t.catch(() => {
  }), t;
}
let tt = Tu();
function Im(t) {
  return typeof t == "object" && t !== null && "then" in t && typeof t.then == "function";
}
let Dn = null, Tn = /* @__PURE__ */ new Set(), X = "", fe = "", ut = null, ds = null, It = null, rt = null, it = null;
function Lu() {
  const t = D?.room;
  return typeof t == "function" ? t() : t;
}
const jt = /* @__PURE__ */ new Map();
let on = null, G = null, cn = null, an = null, ln = null;
function eo(t) {
  if (!wu()) return null;
  const e = jt.get(t);
  if (e)
    return e.refCount++, e.transport;
  const n = new mu({
    host: fe,
    room: t
  }), s = Q?.onSelfChange(() => {
    try {
      n.join({
        identity: Te(),
        page: ze()
      });
    } catch (r) {
      console.warn("[playhtml] Failed to republish identity on change:", r);
    }
  }) ?? null;
  return jt.set(t, {
    transport: n,
    refCount: 1,
    selfChangeUnsub: s
  }), n;
}
function zn(t) {
  const e = jt.get(t);
  if (e && (e.refCount--, !(e.refCount > 0))) {
    jt.delete(t);
    try {
      e.selfChangeUnsub?.();
    } catch {
    }
    try {
      e.transport.destroy();
    } catch {
    }
  }
}
let fs = null, je = null;
const Mm = 5e3, Ln = /* @__PURE__ */ new Set();
let D = null, to = !1;
function In(t) {
  if (typeof t != "function") {
    if (Array.isArray(t)) {
      const e = t.map(In);
      return e.length === 0 ? void 0 : e;
    }
    if (t && typeof t == "object") {
      const e = {};
      for (const n of Object.keys(t).sort()) {
        const s = In(t[n]);
        s !== void 0 && (e[n] = s);
      }
      return Object.keys(e).length === 0 ? void 0 : e;
    }
    return t;
  }
}
function ni(t) {
  return typeof t == "function" ? !0 : Array.isArray(t) ? t.some(ni) : t && typeof t == "object" ? Object.values(t).some(ni) : !1;
}
function $m(t, e) {
  for (const r of Object.keys(e)) {
    const i = typeof e[r] == "function", o = typeof t[r] == "function", c = t[r] !== void 0;
    if (i && c && !o || o && e[r] !== void 0 && !i) return !0;
  }
  const n = In(t) ?? {}, s = In(e) ?? {};
  for (const r of Object.keys(s))
    if (r in n && JSON.stringify(s[r]) !== JSON.stringify(n[r]))
      return !0;
  return !1;
}
function Om(t) {
  return In(t) === void 0 && !ni(t);
}
function si(t) {
  if (D) {
    $m(D, t) && console.warn(
      "[playhtml] Ignoring conflicting config passed after playhtml was already configured. Config is locked to the first declaration. Declare it once up front with playhtml.configure(...) (or matching options at every call site)."
    );
    return;
  }
  if (!Om(t)) {
    if (to) {
      console.warn(
        "[playhtml] Ignoring config passed after playhtml already connected. Declare it before init() — e.g. with playhtml.configure(...) in a script that runs before any component mounts."
      );
      return;
    }
    if (D = {
      ...t,
      ...t.defaultRoomOptions ? { defaultRoomOptions: { ...t.defaultRoomOptions } } : {},
      ...t.cursors ? { cursors: { ...t.cursors } } : {}
    }, t.extraCapabilities)
      for (const [e, n] of Object.entries(t.extraCapabilities))
        Hn[e] = n;
    if (t.events)
      for (const [e, n] of Object.entries(t.events))
        Wu(e, n);
  }
}
function Pm() {
  to = !0;
}
function no(t) {
  const { room: e, partykitHost: n, onError: s, onMessage: r } = t, i = Uy(), o = Fy();
  o.forEach((u) => {
    const h = `${u.domain}${u.path}#${u.elementId}`;
    ei.add(h);
  });
  const c = `playhtml_resetEpoch_${e}`, a = localStorage.getItem(c), l = a ? parseInt(a, 10) : null;
  return H = new $i(n, e, mt, {
    params: {
      sharedElements: JSON.stringify(i),
      sharedReferences: JSON.stringify(o),
      clientResetEpoch: l !== null ? String(l) : null
    }
  }), H.on("error", () => {
    s?.();
  }), H.on("sync", Um), H.on("custom-message", r), { sharedReferences: o };
}
function so() {
  st.disconnect();
  try {
    se?.destroy?.();
  } catch {
  }
  se = null, on !== null && (zn(on), on = null);
  try {
    Lt?.disconnect?.();
  } catch {
  }
  try {
    Lt?.destroy?.();
  } catch {
  }
  Lt = null;
}
function ro() {
  try {
    H?.disconnect?.();
  } catch {
  }
  try {
    H?.destroy?.();
  } catch {
  }
}
function Iu() {
  Zi.clear();
  const t = mt;
  ne = Vl({ play: {} }), mt = Bl(ne), Su = fu(ne.play), Be.clear(), Ge.clear();
  try {
    t.destroy();
  } catch {
  }
}
function Mu() {
  const t = eo(X);
  if (!t) return;
  const e = X;
  cn = e;
  try {
    G = new lm({
      transport: t,
      getIdentity: Te,
      getPage: ze,
      onAwareness: ju
    });
  } catch (n) {
    cn = null, zn(e), console.error("[playhtml] Failed to build element awareness client:", n);
    return;
  }
}
function $u() {
  if (G) {
    try {
      G.destroy();
    } catch {
    }
    G = null, cn !== null && (zn(cn), cn = null);
  }
}
function Rm() {
  if (!G) return;
  const t = [];
  for (const [e, n] of M)
    for (const [s, r] of n)
      r.selfAwareness !== void 0 && t.push([e, s, r.selfAwareness]);
  t.length !== 0 && G.setLocalAwarenessBatch(t);
}
function Ou() {
  const t = eo(X);
  if (t) {
    const e = X;
    ln = e;
    try {
      return an = new vu({
        transport: t,
        getIdentity: Te,
        getPage: ze,
        // Route the cursor channel through the stable hub, not the current cursor
        // client instance, so the subscription survives cursor rebuilds (nav /
        // server reset) and the null-cursor window.
        getCursorPresences: () => st.getPresences(),
        onCursorPresencesChange: (n) => st.subscribe(n)
      }), an;
    } catch (n) {
      ln = null, zn(e), console.error("[playhtml] Failed to build presence client:", n);
    }
  }
  return cu({
    getAwareness: () => (se?.getProvider() ?? H).awareness,
    getPlayerIdentity: Te,
    publishIdentity: !1,
    getCursorPresences: () => st.getPresences(),
    onCursorPresencesChange: (e) => st.subscribe(e)
  });
}
function Pu() {
  if (an) {
    try {
      an.destroy();
    } catch {
    }
    an = null, ln !== null && (zn(ln), ln = null);
  }
}
function io() {
  if (G) return;
  if (it && rt)
    try {
      it.awareness.off("change", rt);
    } catch {
    }
  it = null, rt = null;
  const t = Qs();
  if (!t) return;
  const e = () => ho();
  t.awareness.on("change", e), it = t, rt = e;
}
function oo(t) {
  const { cursors: e, mainRoom: n, partykitHost: s, onError: r } = t;
  if (!e.enabled) {
    Qe = "";
    return;
  }
  if (!Q)
    throw new Error("[playhtml] buildCursors requires the users module to exist first.");
  const i = { ...e };
  let o = H;
  if (i.room) {
    const a = _u(i.room), l = An(window.location.host, a);
    if (l !== n) {
      const u = new me();
      Lt = new $i(
        s,
        l,
        u
      ), Lt.on("error", () => {
        r?.();
      }), o = Lt, Qe = l;
    } else
      Qe = n;
  } else
    Qe = n;
  const c = eo(Qe) ?? void 0;
  on = c ? Qe : null, se = new Py(
    o,
    i,
    c,
    Q
  ), st.connect(se);
}
function Nm(t, e) {
  const n = `playhtml_resetEpoch_${t}`;
  localStorage.setItem(n, String(e)), console.log(
    `[PLAYHTML] Stored resetEpoch=${e} in localStorage key=${n}`
  );
}
function co(t) {
  return new Promise((e, n) => {
    if (q) {
      e();
      return;
    }
    let s = !1, r = null;
    const i = (o) => {
      s || (s = !0, r !== null && clearTimeout(r), Ln.delete(i), o ? n(o) : e());
    };
    Ln.add(i), t !== void 0 && (r = setTimeout(() => {
      i(new Error("Timed out waiting for playhtml room reset sync"));
    }, t));
  });
}
function Um(t) {
  if (t || console.error("Issue connecting to yjs..."), q) return;
  q = !0;
  const e = [...Ln];
  Ln.clear(), e.forEach((n) => n());
}
function Fm(t) {
  if (Nm(X, t), fs) {
    je = Math.max(je ?? 0, t);
    return;
  }
  fs = jm(t).catch((e) => {
    console.error("[PLAYHTML] Failed to reconnect after room-reset:", e), window.location.reload();
  }).finally(() => {
    fs = null, je = null;
  });
}
async function jm(t) {
  let e = t;
  for (; ; ) {
    const n = e;
    if (je = null, await Hm(), je === null || je <= n)
      return;
    e = je;
  }
}
async function Hm() {
  if (!X || !fe)
    throw new Error("playhtml cannot reset before init()");
  ro(), so(), q = !1, Dn = null, Tn.clear(), Iu(), no({
    room: X,
    partykitHost: fe,
    onError: D?.onError,
    onMessage: Qi
  });
  const t = D?.cursors;
  t?.enabled && oo({
    cursors: t,
    mainRoom: X,
    partykitHost: fe,
    onError: D?.onError
  }), Q?.getAll(), io(), ao(), await co(Mm), du(fo()), er(), lo(), se?.refreshContainer?.(), se?.refreshCursorStyles?.(), Ml(X);
}
function zm() {
  It || (It = ((t) => {
    const e = Sl(t.detail?.playerIdentity);
    if (!e?.playerStyle.colorPalette[0] || !Q) return;
    const n = Te(), s = {
      ...e,
      ...typeof n.name == "string" ? { name: n.name } : {}
    };
    Q.adoptIdentity(s), console.log("[playhtml] Merged extension identity via CustomEvent");
  }), document.addEventListener(
    "playhtml:configure-identity",
    It
  ), document.dispatchEvent(new CustomEvent("playhtml:ready")));
}
async function Bm() {
  if (xn) return;
  const t = Lu() ?? Eu(
    D?.defaultRoomOptions ?? { includeSearch: !1 }
  ), e = An(window.location.host, t), n = e !== X, s = D?.cursors, r = !!s?.enabled, o = r !== (se !== null);
  let c = !1;
  if (s?.enabled)
    if (s.room) {
      const a = _u(s.room);
      c = An(window.location.host, a) !== Qe;
    } else
      c = n;
  for (const [a, l] of M)
    for (const [u, h] of [...l.entries()]) {
      const d = h.element;
      (!d || !d.isConnected) && (h.destroy?.(), l.delete(u), G?.removeLocalAwareness(a, u));
    }
  n && (ro(), $u(), Pu(), q = !1, Dn = null, Tn.clear(), Iu(), no({
    room: e,
    partykitHost: fe,
    onError: D?.onError,
    onMessage: Qi
  }), X = e, Mu(), Rm(), kn?.setInner(Ou())), (o || c && s) && (so(), r && s && oo({
    cursors: s,
    mainRoom: e,
    partykitHost: fe,
    onError: D?.onError
  })), (n || o || c) && Q?.getAll(), n && io(), ao(), n && (await co(), du(fo())), er(), lo(), se?.refreshContainer?.(), se?.refreshCursorStyles?.(), Ml(X);
}
function Vm(t = {}) {
  si(t);
}
function Km(t = {}) {
  if (kt)
    return si(t), tt;
  const e = window.playhtml;
  if (e) {
    if (Im(e.ready))
      return tt = e.ready, tt.then(
        () => {
          Zs = !1;
        },
        () => {
        }
      ), kt = !0, tt;
    const s = new Error(
      "playhtml is already set up by an incompatible instance. Make sure @playhtml/react and playhtml use matching versions."
    );
    return ti(s), kt = !0, tt;
  }
  kt = !0, si(t);
  const n = Wm();
  return n.catch((s) => {
    ti(s);
  }), n;
}
async function Wm() {
  Pm();
  const t = D?.host, e = D?.cursors ?? {}, n = Lu() ?? Eu(
    D?.defaultRoomOptions ?? { includeSearch: !1 }
  ), s = D?.onError;
  window.playhtml = Kc, document.documentElement.dataset.playhtml = "true";
  const r = An(window.location.host, n), i = km(t);
  X = r, fe = i, console.log(
    `࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂
࿂࿂࿂࿂  ࿂    ࿂    ࿂    ࿂    ࿂  ࿂࿂࿂࿂
࿂࿂࿂࿂ booting up playhtml... ࿂࿂࿂࿂
࿂࿂࿂࿂  https://playhtml.fun  ࿂࿂࿂࿂
࿂࿂࿂࿂   ࿂     ࿂     ࿂     ࿂   ࿂࿂࿂࿂
࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂`
  );
  const { sharedReferences: o } = no({
    room: r,
    partykitHost: i,
    onError: s,
    onMessage: Qi
  }), c = e.playerIdentity ?? D?.playerIdentity ?? Te();
  Q = Jl(c, {
    getAwareness: () => H.awareness,
    getCursorPresences: () => se?.getCursorPresences() ?? /* @__PURE__ */ new Map(),
    onCursorPresencesChange: (l) => se?.onCursorPresencesChange(l)
  }), oo({
    cursors: e,
    mainRoom: r,
    partykitHost: i,
    onError: s
  }), Q.getAll(), Mu(), zm(), kn = new mm(Ou());
  const a = document.createElement("link");
  if (a.rel = "stylesheet", a.href = "https://unpkg.com/playhtml@latest/dist/style.css", document.head.appendChild(a), D?.developmentMode && (Qr = await import("./development-DUJpN9V9.js"), Qr.setupDevUI(Kc, M)), ao(), await co(), console.log("[PLAYHTML]: Setting up elements... Time to have some fun 🛝"), er(), lo(), Zs = !1, Du(), o.length > 0)
    try {
      const l = o.map((u) => u.elementId);
      H.sendMessage(
        JSON.stringify({ type: "export-permissions", elementIds: l })
      );
    } catch (l) {
      console.error("[PLAYHTML] Error during post-sync setup:", l);
    }
  return H;
}
function Ym(t, e) {
  return G ? G.getLocalAwareness(t, e) : (Qs().awareness.getLocalState()?.[t] ?? {})[e];
}
function Qs() {
  return H;
}
function Ae(t) {
  return t instanceof HTMLElement;
}
function Ru(t) {
  return t.hasAttribute("can-play") ? "none" : "animate";
}
function Nu(t) {
  if ((t.getAttribute("loading-behavior") || Ru(t)) === "none") return;
  t.classList.add("playhtml-loading");
  const n = t.getAttribute("loading-class");
  n && t.classList.add(n), t.setAttribute("aria-busy", "true"), t.setAttribute("aria-live", "polite");
}
function Uu(t) {
  if ((t.getAttribute("loading-behavior") || Ru(t)) === "none") return;
  t.classList.remove("playhtml-loading");
  const n = t.getAttribute("loading-class");
  n && t.classList.remove(n), t.removeAttribute("aria-busy"), t.removeAttribute("aria-live");
}
function ao() {
  for (const t of wt())
    Array.from(
      document.querySelectorAll(`[${t}]`)
    ).filter(Ae).forEach((n) => {
      Nu(n);
    });
}
function lo() {
  for (const t of wt())
    Array.from(
      document.querySelectorAll(`[${t}]`)
    ).filter(Ae).forEach((n) => {
      Uu(n);
    });
}
function Gm(t, e, n) {
  if (typeof n == "function") {
    const s = n(e);
    D?.developmentMode && s !== void 0 && typeof s == "object" && console.warn(
      `[playhtml] A setData() mutator for "${t}" returned an object. Mutators must mutate the draft in place (e.g. \`d => { d.count++ }\`); the return value is ignored. To replace the whole snapshot, pass a value instead of a function.`
    );
    return;
  }
  xs(e, n);
}
function qm(t) {
  const e = Fn(t);
  return !jy(t, e);
}
function Jm(t, e, n, s) {
  const r = n.defaultData instanceof Function ? n.defaultData(t) : n.defaultData, i = n.defaultData === void 0 ? void 0 : xu(e, s, r), o = Ym(e, s);
  return {
    ...n,
    myDefaultAwareness: o !== void 0 ? o : n.myDefaultAwareness,
    devMode: D?.developmentMode ?? !1,
    // Always provide a plain snapshot to render paths
    data: We(i),
    awareness: o !== void 0 ? [o] : n.myDefaultAwareness !== void 0 ? [n.myDefaultAwareness] : void 0,
    element: t,
    onChange: (a) => {
      if (i === void 0) {
        console.error(
          `[playhtml] setData() was called for "${s}", but its initializer does not define \`defaultData\`.`
        );
        return;
      }
      qm(t) && mt.transact(() => {
        Gm(s, i, a);
      });
    },
    onAwarenessChange: (a) => {
      if (G) {
        G.setLocalAwareness(
          e,
          s,
          a
        );
        return;
      }
      const l = Qs(), u = l.awareness.getLocalState()?.[e] || {};
      if (u[s] === a)
        return;
      const h = { ...u, [s]: a };
      l.awareness.setLocalStateField(e, h);
    },
    triggerAwarenessUpdate: () => {
      G || ho();
    }
  };
}
function Xm(t) {
  return uo(t).length === 0;
}
function uo(t) {
  if (t == null)
    return ["initializer"];
  const e = [], n = t.defaultData !== void 0, s = n && t.defaultData !== null && (typeof t.defaultData == "object" || typeof t.defaultData == "function"), r = typeof t.updateElement == "function", i = typeof t.view == "function", o = r || i, c = t.myDefaultAwareness !== void 0, a = typeof t.updateElementAwareness == "function", l = o || a;
  return n && !s && e.push("defaultData must be an object or function"), n && !o ? e.push("defaultData requires updateElement or view") : !n && o && e.push("updateElement or view requires defaultData"), c && !a && e.push("myDefaultAwareness requires updateElementAwareness"), e.length === 0 && !l && e.push("updateElement, view, or updateElementAwareness"), e;
}
function Bc(t) {
  const e = t, n = {}, s = [
    "defaultData",
    "defaultLocalData",
    "myDefaultAwareness",
    "updateElement",
    "view",
    "updateElementAwareness",
    "onDrag",
    "onDragStart",
    "onClick",
    "onMount",
    "resetShortcut",
    "debounceMs",
    "isValidElementForTag"
  ];
  for (const r of s)
    e[r] !== void 0 && (n[r] = e[r]);
  return n;
}
function Fu(t, e) {
  return t === Z.CanPlay || !e.hasAttribute(Z.CanPlay);
}
function Zm(t, e) {
  if (t === Z.CanPlay)
    return Bc(e);
  const n = Hn[t];
  if (!n) return;
  if (!Fu(t, e))
    return n;
  const s = Bc(e);
  return { ...n, ...s };
}
function ho() {
  const e = Qs().awareness.getStates(), n = cy(
    e
  );
  if (n === Dn)
    return;
  Dn = n;
  const s = /* @__PURE__ */ new Map();
  e.forEach((r, i) => {
    const o = yt(
      r,
      i
    );
    Object.keys(r).forEach((c) => {
      if (c.startsWith("__")) return;
      const a = r[c];
      !a || typeof a != "object" || Object.keys(a).forEach((l) => {
        const u = a[l], h = `${c}:${l}`;
        s.has(h) || s.set(h, { array: [], byStableId: /* @__PURE__ */ new Map() });
        const d = s.get(h);
        d.array.push(u), d.byStableId.set(o, u);
      });
    });
  }), ju(s);
}
function ju(t) {
  t.forEach(({ array: e, byStableId: n }, s) => {
    ve(
      () => Vc(s, e, n),
      "element awareness handler"
    );
  });
  for (const e of Tn)
    t.has(e) || ve(
      () => Vc(e, [], /* @__PURE__ */ new Map()),
      "element awareness handler"
    );
  Tn = new Set(t.keys());
}
function Vc(t, e, n) {
  const s = t.indexOf(":"), r = t.slice(0, s), i = t.slice(s + 1), o = M.get(r);
  if (!o) return;
  const c = o.get(i);
  c && c.updateAwareness(e, n);
}
function er() {
  if (q) {
    for (const [t, e] of bt) {
      const n = document.getElementById(t);
      n && Ae(n) && tr(n, e);
    }
    for (const t of wt()) {
      const e = Array.from(
        document.querySelectorAll(`[${t}]`)
      ).filter(Ae);
      e.length && Promise.all(
        e.map((n) => Kt(n, t))
      );
    }
    xn && (G ? G.refresh() : (io(), ho()), ut = Eg(async () => {
      await Bm();
    }), ds = _g(ut), xn = !1);
  }
}
function fo() {
  return {
    ensureProxy: xu,
    getProxy: (t, e) => Be.get(t)?.get(e),
    // Getters so a handle held across a room change (which recreates store/doc)
    // reads the current ones, not stale references captured at creation.
    getDoc: () => mt,
    getStorePlay: () => ne.play,
    proxyByTagAndId: Be,
    yObserverByKey: Ge,
    channelRefCounts: Au,
    channelListeners: ku
  };
}
function Qm(t, e) {
  if (!q)
    throw new Error("playhtml.createPageData is not available before init()");
  return Hy(t, e, fo());
}
function e0(t) {
  if (!q)
    throw new Error("playhtml.createPresenceRoom is not available before init()");
  const e = An(window.location.host, t), n = wu() ? new mu({ host: fe, room: e }) : null;
  if (n) {
    const c = Q?.onSelfChange(() => {
      try {
        n.join({ identity: Te(), page: ze() });
      } catch (u) {
        console.warn(
          "[playhtml] Failed to republish identity on change:",
          u
        );
      }
    }) ?? null, a = new vu({
      transport: n,
      getIdentity: Te,
      getPage: ze
    });
    let l = !1;
    return {
      presence: a,
      destroy: () => {
        if (!l) {
          l = !0;
          try {
            c?.();
          } catch {
          }
          try {
            a.destroy();
          } catch {
          }
          try {
            n.destroy();
          } catch {
          }
        }
      }
    };
  }
  const s = new me(), r = new $i(fe, e, s), i = cu({
    getAwareness: () => r.awareness,
    getPlayerIdentity: Te,
    publishIdentity: !0
  });
  let o = !1;
  return {
    presence: i,
    destroy: () => {
      o || (o = !0, r.destroy(), s.destroy());
    }
  };
}
async function b0() {
  if (!(xn && !kt)) {
    if (Zi.clear(), ut && (ut.destroy(), ut = null), ds && (ds(), ds = null), It && (document.removeEventListener(
      "playhtml:configure-identity",
      It
    ), It = null), it && rt)
      try {
        it.awareness.off("change", rt);
      } catch {
      }
    it = null, rt = null;
    for (const [, t] of M) {
      for (const e of t.values())
        try {
          e.destroy?.();
        } catch {
        }
      t.clear();
    }
    M.clear(), Au.clear(), ku.clear(), Ln.clear(), $u(), Pu(), so(), ro();
    try {
      Q?.destroy();
    } catch {
    }
    Q = null;
    for (const [, t] of jt) {
      try {
        t.selfChangeUnsub?.();
      } catch {
      }
      try {
        t.transport.destroy();
      } catch {
      }
    }
    jt.clear(), on = null;
    try {
      Qr?.teardownDevUI();
    } catch {
    }
    document.head.querySelectorAll("link[href*='playhtml']").forEach((t) => t.remove()), document.querySelectorAll("#playhtml-cursor-styles").forEach((t) => t.remove()), delete window.playhtml, delete document.documentElement.dataset.playhtml, q = !1, Dn = null, Tn.clear(), xn = !0, Zs = !0, kt = !1, tt = Tu(), X = "", fe = "", kn = null, st.subscribers.clear(), fs = null, je = null, D = null, to = !1;
  }
}
const Kc = {
  init: Km,
  configure: Vm,
  get isLoading() {
    return Zs;
  },
  get ready() {
    return tt;
  },
  handleNavigation: async function() {
    ut && await ut.trigger();
  },
  setupPlayElements: er,
  setupPlayElement: zu,
  removePlayElement: Bn,
  deleteElementData: l0,
  setupPlayElementForTag: Kt,
  register: o0,
  define: c0,
  getHandle: Ku,
  get syncedStore() {
    return Su;
  },
  elementHandlers: M,
  dispatchPlayEvent: u0,
  registerPlayEventListener: Wu,
  removePlayEventListener: h0,
  get cursorClient() {
    return se;
  },
  get presence() {
    if (!kn)
      throw new Error("playhtml.presence is not available before init()");
    return kn;
  },
  get users() {
    if (!Q)
      throw new Error("playhtml.users is not available before init()");
    return Q;
  },
  // Filled after init
  get roomId() {
    return X;
  },
  get host() {
    return fe;
  },
  createPageData: Qm,
  createPresenceRoom: e0,
  listSharedElements: Sg
};
function t0(t) {
  if (t === J)
    throw new Error(`"${J}" is a reserved tag name for page-level data`);
  M.has(t) || q && (M.has(t) || M.set(t, /* @__PURE__ */ new Map()), ne.play[t] ??= {});
}
function n0(t, e) {
  const n = Fu(e, t) ? t.isValidElementForTag : void 0;
  return typeof n == "function" ? n(t) : Hn[e]?.isValidElementForTag?.(t) ?? !0;
}
function Wc(t) {
  const e = t.tagName.toLowerCase(), n = t.id ? `#${t.id}` : "", s = Array.from(t.classList).map((r) => `.${r}`).join("");
  return `<${e}${n}${s}>`;
}
function s0(t, e, n, s) {
  console.error(
    `[playhtml] Duplicate element id "${e}" for ${t}. Element IDs must be unique per capability tag because playhtml stores shared data by tag and ID. Keeping ${Wc(n)} and ignoring ${Wc(s)}.`,
    { existingElement: n, duplicateElement: s }
  );
}
function r0(t, e, n) {
  const s = M.get(t)?.get(e);
  !s || s.element === n || s.element.isConnected || Bn(s.element);
}
async function Kt(t, e) {
  if (!n0(t, e) || !q)
    return;
  if (!t.id) {
    const c = t.getAttribute("selector-id");
    if (c) {
      const a = zc.get(c) ?? 0;
      t.id = btoa(`${e}-${c}-${a}`), zc.set(c, a + 1);
    } else
      t.id = await oy(e, t);
  }
  const n = Fn(t);
  if (!n) {
    console.error(
      `Element ${t} does not have an acceptable ID. Please add an ID to the element to register it as a playhtml element.`
    );
    return;
  }
  t0(e);
  const s = M.get(e);
  r0(e, n, t);
  const r = Zm(
    e,
    t
  );
  if (!Xm(r)) {
    const c = uo(r);
    console.error(
      `Element ${n} does not have proper info to initialize a playhtml element. Missing or invalid initializer properties: ${c.join(", ")}. Please refer to https://github.com/spencerc99/playhtml#can-play for troubleshooting help.`
    );
    return;
  }
  const i = Jm(
    t,
    e,
    r,
    n
  ), o = s.get(n);
  if (o) {
    if (o.element !== t) {
      s0(
        e,
        n,
        o.element,
        t
      );
      return;
    }
    o.reinitializeElementData(i), Hu(e, n, o), Yc(e, n);
    return;
  } else {
    const c = new iy(
      i,
      e === Z.CanMirror ? { scheduleSetupDataWrite: (a) => Zi.queue(a) } : void 0
    );
    s.set(n, c), r.view && (c.onAfterRender = a0, c.observeDescendants()), e === Z.CanMirror && Bu(t);
  }
  i.triggerAwarenessUpdate?.(), t.classList.add("__playhtml-element"), t.style.setProperty("--jiggle-delay", `${Math.random() * 1}s;}`), Yc(e, n);
}
function Hu(t, e, n) {
  const s = ne.play[t]?.[e];
  if (s === void 0) return !1;
  const r = `${t}:${e}`;
  Hc.add(r);
  try {
    n.__data = We(s), t === Z.CanMirror && Bu(n.element);
  } finally {
    Hc.delete(r);
  }
  return !0;
}
function Yc(t, e) {
  const n = `${t}:${e}`, s = M.get(t);
  if (!s) return;
  const r = s.get(e);
  if (!r) return;
  const i = ye(ne.play[t]?.[e]);
  if (!i || typeof i.observeDeep != "function") return;
  const o = Ge.get(n);
  o && i.unobserveDeep(o);
  let c = !1;
  const a = () => {
    c || (c = !0, queueMicrotask(() => {
      c = !1, Hu(t, e, r) && Is.add(n);
    }));
  };
  if (i.observeDeep(a), Ge.set(n, a), D?.developmentMode) {
    const l = r.element;
    if (l && l.hasAttribute && l.hasAttribute("data-source") && !lt.has(n)) {
      const u = window.setTimeout(() => {
        Is.has(n) || console.warn(
          `[playhtml] Shared reference ${t}:${e} has not received data. Check data-source and source availability.`
        ), lt.delete(n);
      }, 3e3);
      lt.set(n, u);
    }
  }
}
function zu(t, { ignoreIfAlreadySetup: e } = {}) {
  if (t.hasAttribute?.("data-source") && t.hasAttribute?.("shared")) {
    const s = t.id || "<no-id>";
    console.error(
      `[playhtml] Element ${s} has both 'data-source' and 'shared'. Ignoring. A single element cannot be both a consumer and a source.`
    );
    return;
  }
  if (e && Array.from(M.values()).some(
    (s) => s.has(t.id)
  ))
    return;
  if (!Ae(t)) {
    console.log(`Element ${t.id} not an HTML element. Ignoring.`);
    return;
  }
  t.id && bt.has(t.id) && tr(t, bt.get(t.id)), t.hasAttribute("data-source") && xm(t), t.hasAttribute("shared") && Dm(t), wt().some(
    (s) => t.hasAttribute(s)
  ) && (q ? Uu(t) : Nu(t)), Promise.all(
    wt().filter((s) => t.hasAttribute(s)).map((s) => Kt(t, s))
  );
}
function Bu(t) {
  const e = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map();
  for (const r of wt())
    t.querySelectorAll(`[${r}]`).forEach((i) => {
      if (Ae(i)) {
        e.add(i);
        const o = Fn(i);
        o && n.set(`${r}:${o}`, i);
      }
    });
  jc.get(t)?.forEach((r, i) => {
    n.get(i) !== r && Bn(r);
  }), e.forEach((r) => {
    zu(r);
  }), jc.set(t, n);
}
function Bn(t) {
  if (!t || !t.id)
    return;
  const e = Fn(t);
  if (e)
    for (const [n, s] of M) {
      const r = s.get(e);
      if (!r || r.element !== t)
        continue;
      const i = `${n}:${e}`, o = ye(ne.play[n]?.[e]), c = Ge.get(i);
      o && c && typeof o.unobserveDeep == "function" && o.unobserveDeep(c), Ge.delete(i), Is.delete(i);
      const a = lt.get(i);
      a !== void 0 && (clearTimeout(a), lt.delete(i)), r.destroy?.(), G?.removeLocalAwareness(n, e), s.delete(e);
    }
}
const bt = /* @__PURE__ */ new Map();
function Vu(t, e) {
  if (e.view && e.updateElement)
    throw new Error(
      `[playhtml] "${t}" defines both \`view\` and \`updateElement\`. They are mutually exclusive — pick one.`
    );
  if (e.view && (e.onClick || e.onDrag || e.onDragStart))
    throw new Error(
      `[playhtml] "${t}" defines \`view\` alongside an element event handler (onClick/onDrag/onDragStart). In view mode, attach events inside the template (e.g. \`@click=\${...}\`) instead.`
    );
  if (e.defaultData !== void 0 && typeof e.defaultData != "function" && (typeof e.defaultData != "object" || e.defaultData === null))
    throw new Error(
      `[playhtml] "${t}" has a non-object \`defaultData\`. Use an object (e.g. \`{ count: 0 }\`) so the shape can grow without a data migration.`
    );
  const n = uo(e);
  if (n.length > 0)
    throw new Error(
      `[playhtml] "${t}" has an invalid initializer: ${n.join(", ")}.`
    );
}
function tr(t, e) {
  Object.assign(t, e), t.hasAttribute(Z.CanPlay) || t.setAttribute(Z.CanPlay, "");
}
function i0(t) {
  if (!q) return;
  const e = bt.get(t);
  if (!e) return;
  const n = document.getElementById(t);
  !n || !Ae(n) || (tr(n, e), Kt(n, Z.CanPlay));
}
function Zt(t, e) {
  if (e !== void 0)
    return M.get(e)?.get(t);
  const n = M.get(Z.CanPlay)?.get(t);
  if (n) return n;
  for (const [, s] of M) {
    const r = s.get(t);
    if (r) return r;
  }
}
function is(t, e) {
  D?.developmentMode && console.warn(
    `[playhtml] ${t}("${e}") — no bound element with that id yet; the write was dropped. Register/add the element first, or check the id.`
  );
}
function Ku(t, e) {
  return {
    id: t,
    getElement: () => document.getElementById(t),
    getData: () => Zt(t, e)?.data,
    setData: (n) => {
      const s = Zt(t, e);
      if (!s) return is("setData", t);
      s.setData(n);
    },
    setLocalData: (n) => {
      const s = Zt(t, e);
      if (!s) return is("setLocalData", t);
      s.setLocalData(n);
    },
    setMyAwareness: (n) => {
      const s = Zt(t, e);
      if (!s) return is("setMyAwareness", t);
      s.setMyAwareness(n);
    },
    requestUpdate: () => {
      const n = Zt(t, e);
      if (!n) return is("requestUpdate", t);
      n.requestUpdate();
    },
    unregister: () => {
      bt.delete(t);
      const n = document.getElementById(t);
      n && Bn(n);
    }
  };
}
function o0(t, e) {
  return Vu(t, e), bt.set(t, e), i0(t), D?.developmentMode && q && !document.getElementById(t) && console.warn(
    `[playhtml] register("${t}") — no element with that id is in the DOM yet. It will bind automatically when the element appears.`
  ), Ku(
    t,
    Z.CanPlay
  );
}
function c0(t, e) {
  if (t === J)
    throw new Error(`"${J}" is a reserved tag name for page-level data`);
  if (t === Z.CanPlay)
    throw new Error(
      `[playhtml] "${Z.CanPlay}" is reserved — use register(id, init) for single elements.`
    );
  if (Object.prototype.hasOwnProperty.call(Il, t))
    throw new Error(
      `[playhtml] "${t}" is a built-in capability and cannot be redefined.`
    );
  if (Vu(t, e), Hn[t] = e, q) {
    const n = Array.from(
      document.querySelectorAll(`[${t}]`)
    ).filter(Ae);
    Promise.all(
      n.map((s) => Kt(s, t))
    );
  }
}
const Gc = /* @__PURE__ */ new WeakMap();
function a0(t) {
  for (const [s, r] of bt) {
    if (s === t.id) continue;
    const i = document.getElementById(s);
    i && t.contains(i) && Ae(i) && tr(i, r);
  }
  const e = /* @__PURE__ */ new Map();
  for (const s of wt()) {
    const r = Array.from(t.querySelectorAll(`[${s}]`)).filter(
      Ae
    );
    for (const i of r) {
      if (i === t) continue;
      if (!i.id) {
        D?.developmentMode && console.warn(
          `[playhtml] a view rendered a "${s}" element with no id; it won't bind. Give capability children a stable, unique id (key keyed lists by it).`
        );
        continue;
      }
      e.set(`${s}:${i.id}`, i);
      const o = M.get(s)?.get(i.id);
      o && o.element === i || Kt(i, s);
    }
  }
  const n = Gc.get(t);
  if (n)
    for (const [s, r] of n)
      e.has(s) || Bn(r);
  Gc.set(t, e);
}
function l0(t, e) {
  if (!q) {
    console.warn(
      `[PLAYHTML] Cannot remove element data before sync: ${t}:${e}`
    );
    return;
  }
  const n = `${t}:${e}`, s = ye(ne.play[t]?.[e]);
  if (s && typeof s.observeDeep == "function") {
    const a = Ge.get(n);
    if (a) {
      try {
        s.unobserveDeep(a);
      } catch (l) {
        console.warn(`[PLAYHTML] Failed to remove observer for ${n}:`, l);
      }
      Ge.delete(n);
    }
  }
  const r = ne.play[t];
  if (r && e in r)
    try {
      mt.transact(() => {
        delete r[e];
      });
    } catch (a) {
      console.warn(
        `[PLAYHTML] Failed to remove SyncedStore data for ${n}:`,
        a
      );
    }
  const i = Be.get(t);
  i && (i.delete(e), i.size === 0 && Be.delete(t));
  const o = M.get(t);
  o && o.delete(e), Is.delete(n);
  const c = lt.get(n);
  c !== void 0 && (clearTimeout(c), lt.delete(n));
}
function u0(t) {
  const { type: e } = t;
  if (!Ft.has(e)) {
    console.error(`[playhtml] event "${e}" not registered.`);
    return;
  }
  Lm(t);
}
function Wu(t, e) {
  const n = String(Tm++);
  return Ft.set(t, [
    ...Ft.get(t) ?? [],
    { type: t, ...e, id: n }
  ]), n;
}
function h0(t, e) {
  const n = Ft.get(t);
  if (!n)
    return;
  const s = n.findIndex((r) => r.id === e);
  s !== -1 && (n.splice(s, 1), n.length === 0 && Ft.delete(t));
}
export {
  F as A,
  Il as E,
  yg as a,
  f0 as b,
  y0 as c,
  m0 as d,
  M as e,
  w0 as f,
  Fn as g,
  bg as i,
  Sg as l,
  mg as n,
  wg as o,
  Kc as p,
  b0 as r,
  Z as s,
  p0 as w
};
