/**
 * 두 값의 얕은 동등성을 비교합니다.
 * 객체와 배열은 1단계 깊이까지만 비교합니다.
 */
export const shallowEquals = (a: unknown, b: unknown): boolean => {
  // 여기를 구현하세요.
  // Object.is(), Array.isArray(), Object.keys() 등을 활용하여 1단계 깊이의 비교를 구현합니다.

  // Object.is로 먼저 비교
  if (Object.is(a, b)) {
    return true;
  }

  // null이나 undefined 체크
  if (a == null || b == null) {
    return false;
  }

  // 타입이 다르면 false
  if (typeof a !== typeof b) {
    return false;
  }

  // 객체나 배열이 아니면 false (Object.is에서 이미 비교했으므로)
  if (typeof a !== "object" || typeof b !== "object") {
    return false;
  }

  // 배열 비교
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!Object.is(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }

  // 하나만 배열이면 false
  if (Array.isArray(a) || Array.isArray(b)) {
    return false;
  }

  // 객체 비교
  const keysA = Object.keys(a as object);
  const keysB = Object.keys(b as object);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) {
      return false;
    }
    if (!Object.is((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) {
      return false;
    }
  }

  return true;
};

/**
 * 두 값의 깊은 동등성을 비교합니다.
 * 객체와 배열의 모든 중첩된 속성을 재귀적으로 비교합니다.
 */
export const deepEquals = (a: unknown, b: unknown): boolean => {
  // Object.is로 먼저 비교
  if (Object.is(a, b)) {
    return true;
  }

  // null이나 undefined 체크
  if (a == null || b == null) {
    return false;
  }

  // 타입이 다르면 false
  if (typeof a !== typeof b) {
    return false;
  }

  // 객체나 배열이 아니면 false (Object.is에서 이미 비교했으므로)
  if (typeof a !== "object" || typeof b !== "object") {
    return false;
  }

  // 배열 비교
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!deepEquals(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }

  // 하나만 배열이면 false
  if (Array.isArray(a) || Array.isArray(b)) {
    return false;
  }

  // 객체 비교
  const keysA = Object.keys(a as object);
  const keysB = Object.keys(b as object);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) {
      return false;
    }
    if (!deepEquals((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) {
      return false;
    }
  }

  return true;
};
