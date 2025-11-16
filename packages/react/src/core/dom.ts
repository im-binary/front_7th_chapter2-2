/* eslint-disable @typescript-eslint/no-explicit-any */
import { NodeTypes } from "./constants";
import { Instance } from "./types";

const isEventProp = (key: string) => key.startsWith("on");
const isStyleProp = (key: string) => key === "style";
const isChildrenProp = (key: string) => key === "children";
const isAttributeProp = (key: string) => key.startsWith("data-") || key.startsWith("aria-");

/**
 * DOM 요소에 속성(props)을 설정합니다.
 * 이벤트 핸들러, 스타일, className 등 다양한 속성을 처리해야 합니다.
 */
export const setDomProps = (dom: HTMLElement, props: Record<string, any> = {}): void => {
  // 여기를 구현하세요.

  if (!props) return;

  Object.keys(props).forEach((key) => {
    if (isChildrenProp(key)) {
      return;
    }

    const value = props[key];

    if (isEventProp(key)) {
      const eventType = key.toLowerCase().substring(2);
      dom.addEventListener(eventType, value);
    } else if (isStyleProp(key)) {
      Object.assign(dom.style, value);
    } else if (key === "className") {
      dom.className = value;
    } else if (isAttributeProp(key)) {
      // data-*, aria-* 속성은 항상 setAttribute 사용
      dom.setAttribute(key, value);
    } else if (key in dom) {
      // DOM 프로퍼티로 설정 (checked, value, disabled 등)
      (dom as any)[key] = value;
    } else {
      // 일반 속성
      dom.setAttribute(key, value);
    }
  });
};

/**
 * 이전 속성과 새로운 속성을 비교하여 DOM 요소의 속성을 업데이트합니다.
 * 변경된 속성만 효율적으로 DOM에 반영해야 합니다.
 */
export const updateDomProps = (
  dom: HTMLElement,
  prevProps: Record<string, any> = {},
  nextProps: Record<string, any> = {},
): void => {
  // 여기를 구현하세요.

  // 이전 props 제거
  Object.keys(prevProps).forEach((key) => {
    if (isChildrenProp(key)) {
      return;
    }

    if (!(key in nextProps)) {
      if (isEventProp(key)) {
        const eventType = key.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevProps[key]);
      } else if (isStyleProp(key)) {
        // 스타일 제거
        Object.keys(prevProps[key] || {}).forEach((styleProp) => {
          (dom.style as any)[styleProp] = "";
        });
      } else if (key === "className") {
        dom.className = "";
      } else if (isAttributeProp(key)) {
        dom.removeAttribute(key);
      } else if (key in dom) {
        (dom as any)[key] = "";
      } else {
        dom.removeAttribute(key);
      }
    }
  });

  // 새로운 props 설정
  Object.keys(nextProps).forEach((key) => {
    if (isChildrenProp(key)) {
      return;
    }

    const value = nextProps[key];
    const prevValue = prevProps[key];

    if (value !== prevValue) {
      // 이전 이벤트 리스너 제거
      if (isEventProp(key) && prevValue) {
        const eventType = key.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevValue);
      }

      if (isEventProp(key)) {
        const eventType = key.toLowerCase().substring(2);
        dom.addEventListener(eventType, value);
      } else if (isStyleProp(key)) {
        Object.assign(dom.style, value);
      } else if (key === "className") {
        dom.className = value;
      } else if (isAttributeProp(key)) {
        dom.setAttribute(key, value);
      } else if (key in dom) {
        (dom as any)[key] = value;
      } else {
        dom.setAttribute(key, value);
      }
    }
  });
};

/**
 * 주어진 인스턴스에서 실제 DOM 노드(들)를 재귀적으로 찾아 배열로 반환합니다.
 * Fragment나 컴포넌트 인스턴스는 여러 개의 DOM 노드를 가질 수 있습니다.
 */
export const getDomNodes = (instance: Instance | null): (HTMLElement | Text)[] => {
  // 여기를 구현하세요.

  if (!instance) {
    return [];
  }

  // HOST나 TEXT 노드는 DOM을 직접 가지고 있음
  if (instance.kind === NodeTypes.HOST || instance.kind === NodeTypes.TEXT) {
    return instance.dom ? [instance.dom] : [];
  }

  // Fragment나 Component는 자식들의 DOM을 수집
  const nodes: (HTMLElement | Text)[] = [];
  for (const child of instance.children) {
    nodes.push(...getDomNodes(child));
  }
  return nodes;
};

/**
 * 주어진 인스턴스에서 첫 번째 실제 DOM 노드를 찾습니다.
 */
export const getFirstDom = (instance: Instance | null): HTMLElement | Text | null => {
  // 여기를 구현하세요.

  if (!instance) {
    return null;
  }

  if (instance.kind === NodeTypes.HOST || instance.kind === NodeTypes.TEXT) {
    return instance.dom;
  }

  return getFirstDomFromChildren(instance.children);
};

/**
 * 자식 인스턴스들로부터 첫 번째 실제 DOM 노드를 찾습니다.
 */
export const getFirstDomFromChildren = (children: (Instance | null)[]): HTMLElement | Text | null => {
  // 여기를 구현하세요.

  for (const child of children) {
    const dom = getFirstDom(child);
    if (dom) {
      return dom;
    }
  }
  return null;
};

/**
 * 인스턴스를 부모 DOM에 삽입합니다.
 * anchor 노드가 주어지면 그 앞에 삽입하여 순서를 보장합니다.
 */
export const insertInstance = (
  parentDom: HTMLElement,
  instance: Instance | null,
  anchor: HTMLElement | Text | null = null,
): void => {
  // 여기를 구현하세요.

  if (!instance) {
    return;
  }

  const domNodes = getDomNodes(instance);
  for (const node of domNodes) {
    if (anchor) {
      parentDom.insertBefore(node, anchor);
    } else {
      parentDom.appendChild(node);
    }
  }
};

/**
 * 부모 DOM에서 인스턴스에 해당하는 모든 DOM 노드를 제거합니다.
 */
export const removeInstance = (parentDom: HTMLElement, instance: Instance | null): void => {
  // 여기를 구현하세요.

  if (!instance) {
    return;
  }

  const domNodes = getDomNodes(instance);
  for (const node of domNodes) {
    if (node.parentNode === parentDom) {
      parentDom.removeChild(node);
    }
  }
};
