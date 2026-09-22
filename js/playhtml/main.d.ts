import { CanDuplicateTo } from "@playhtml/common";
import { CanMoveBounds } from "@playhtml/common";
import { CanMoveBoundsMinVisible } from "@playhtml/common";
import { CanMoveBoundsMinVisiblePx } from "@playhtml/common";
import { classMap } from 'lit-html/directives/class-map.js';
import { Cursor } from "@playhtml/common";
import { CursorEvents } from "@playhtml/common";
import { CursorEvents as CursorEvents_2 } from "@playhtml/common";
import { CursorPresence } from "@playhtml/common";
import { CursorPresenceView } from "@playhtml/common";
import { CursorPresenceView as CursorPresenceView_2 } from "@playhtml/common";
import { default as default_2 } from 'y-partyserver/provider';
import { default as default_3 } from 'partysocket';
import { ElementAwarenessEventHandlerData } from "@playhtml/common";
import { ElementData } from "@playhtml/common";
import { ElementEventHandlerData } from "@playhtml/common";
import { ElementInitializer } from "@playhtml/common";
import { ElementSetupData } from "@playhtml/common";
import { EventMessage } from "@playhtml/common";
import { getIdForElement } from "@playhtml/common";
import { html } from 'lit-html';
import { ModifierKey } from "@playhtml/common";
import { nothing } from 'lit-html';
import { PageDataChannel } from "@playhtml/common";
import { PartySocketOptions } from 'partysocket';
import { PlayerIdentity } from "@playhtml/common";
import { PlayerIdentity as PlayerIdentity_2 } from "@playhtml/common";
import { PlayEvent } from "@playhtml/common";
import { PresenceAPI } from "@playhtml/common";
import { PresenceRoom } from "@playhtml/common";
import { PresenceServerMessage } from "@playhtml/common";
import { PresenceView } from "@playhtml/common";
import { repeat } from 'lit-html/directives/repeat.js';
import { styleMap } from 'lit-html/directives/style-map.js';
import { svg } from 'lit-html';
import { TagType } from "@playhtml/common";
import { TagTypeToElement } from "@playhtml/common";
import { User } from "@playhtml/common";
import { ViewTemplate } from "@playhtml/common";

export { CanDuplicateTo }

export { CanMoveBounds }

export { CanMoveBoundsMinVisible }

export { CanMoveBoundsMinVisiblePx }

export { classMap }

/**
 * Declare config for this playhtml instance without connecting. Idempotent and
 * framework-agnostic: call it once, up front, from wherever owns the config (a
 * <head> script, PlayProvider, an island). Connection happens later via init()
 * / standalone component mount, which read whatever config was declared here.
 *
 * Use this when you can't put a single init() at the top of your app — Astro
 * islands, multi-page apps, multiple React roots — so config doesn't depend on
 * which "ensure running" call happens to run first. The first declaration wins;
 * a later conflicting one warns and is ignored.
 */
declare function configurePlayHTML(options?: InitOptions): void;

declare function createPageData<T>(name: string, defaultValue: T): PageDataChannel<T>;

declare function createPresenceRoom(name: string): PresenceRoom;

export { Cursor }

declare class CursorClientAwareness {
    private provider;
    private options;
    private presenceTransport?;
    private cursors;
    private cursorAnimators;
    private spatialGrid;
    private proximityUsers;
    private currentCursor;
    private users;
    private ownsUsers;
    private unsubscribeSelfChange;
    private unsubscribeUsersChange;
    private awarenessUpdateTimeout;
    private lastUpdate;
    private pointerFrame;
    private pendingPointerSample;
    private cursorEventCleanups;
    private ownCursorSvgCache;
    private visibilityThreshold;
    private isStylesAdded;
    private globalApiListeners;
    private activeAnimationCleanups;
    private chat;
    private currentMessage;
    private otherUsersWithMessages;
    private lastSentMessage;
    private cursorPresenceChangeCallbacks;
    private coordinateMode;
    private presenceStore;
    private presenceTransportUnsubscribe;
    private serverCursorMaxHz;
    private getContainerMatrix;
    private clientToStorage;
    private storageToClient;
    private zones;
    private currentZone;
    private cursorZoneState;
    private cursorStyleKeys;
    private lastKnownContainer;
    private clientIdToStableId;
    private pendingRemovals;
    private get playerIdentity();
    constructor(provider: default_2, options?: CursorOptions, presenceTransport?: RealtimePresenceTransport | undefined, users?: UsersAPI);
    private lastKnownColor;
    private lastKnownName;
    private lastKnownAllColors;
    private handleSelfIdentityChange;
    private handleUsersChange;
    private initialize;
    private setupAwarenessHandling;
    private setupPresenceTransportHandling;
    private onPeerCursorChange;
    private handlePresenceControlMessage;
    private handlePresenceRate;
    private renderPresenceStore;
    private syncExistingAwareness;
    private handleAwarenessChange;
    private hasOtherClientForStableId;
    private cursorPresenceEntries;
    private activeCursorPresenceEntries;
    private isFreshCursorPresence;
    private rebuildSpatialGrid;
    private checkProximityOptimized;
    private addCursorStyles;
    private createCursorPositionCallback;
    private resolveTargetCoords;
    private applyZoneStyling;
    private hitTestZones;
    private getOwnCursorSvg;
    private addCursorEventListener;
    private requestPointerFrame;
    private cancelPointerFrame;
    private queuePointerSample;
    private processPointerSample;
    private setupCursorTracking;
    private repositionAllCursors;
    private snapCursorToPresence;
    private getActiveCursorConnectionCount;
    private scheduleCursorAwarenessUpdate;
    private updateCursorAwareness;
    private publishPresenceTransportState;
    private getContainer;
    refreshContainer(): void;
    refreshCursorStyles(): void;
    private findAwarenessByStableId;
    private updateCursor;
    private createCursorElement;
    private getMouseCursorSVG;
    private getTouchCursorSVG;
    private getCustomCursorSVG;
    private removeCursor;
    private setupGlobalAPI;
    private emitGlobalEvent;
    private updateChatCTA;
    private updateCursorMessage;
    private updateCursorName;
    private opacifyColor;
    private hslToRgb;
    private getLuminance;
    private getContrastColor;
    private updateAllCursorVisibility;
    private showAllCursors;
    configure(options: Partial<CursorOptions>): void;
    registerZone(element: HTMLElement, options?: CursorZoneOptions): void;
    unregisterZone(elementId: string): void;
    hideCursor(connectionId: string): void;
    showCursor(connectionId: string): void;
    destroy(): void;
    getDebugInfo(): {
        totalCursors: number;
        gridCells: number;
        avgCursorsPerCell: number;
    };
    on<K extends keyof CursorEvents_2>(event: K, callback: (value: CursorEvents_2[K]) => void): void;
    off<K extends keyof CursorEvents_2>(event: K, callback: (value: CursorEvents_2[K]) => void): void;
    getSnapshot(): CursorEvents_2;
    getMyPlayerIdentity(): PlayerIdentity_2;
    getProvider(): default_2;
    getCursorPresences(): Map<string, CursorPresenceView_2>;
    onCursorPresencesChange(callback: (presences: Map<string, CursorPresenceView_2>) => void): () => void;
    private notifyCursorPresenceListeners;
    /**
     * Apply a CSS class to a specific cursor element identified by the player's stableId (publicKey).
     * The class is added to the actual rendered cursor DOM element and removed after `durationMs`.
     * Returns true if the cursor element was found and the animation was applied.
     */
    triggerCursorAnimation(stableId: string, animationClass: string, durationMs?: number): boolean;
    private triggerSelfCursorAnimation;
}

export declare type CursorContainer = HTMLElement | string | (() => HTMLElement | null);

export declare type CursorCoordinateMode = "relative" | "absolute";

export { CursorEvents }

export declare interface CursorOptions {
    enabled?: boolean;
    playerIdentity?: PlayerIdentity;
    proximityThreshold?: number;
    visibilityThreshold?: number;
    cursorStyle?: string;
    coordinateMode?: CursorCoordinateMode;
    onProximityEntered?: (playerIdentity?: PlayerIdentity, positions?: {
        ours: {
            x: number;
            y: number;
        };
        theirs: {
            x: number;
            y: number;
        };
    }, angle?: number) => void;
    onProximityLeft?: (connectionId: string) => void;
    onCustomCursorRender?: (connectionId: string, element: HTMLElement) => HTMLElement | null;
    enableChat?: boolean;
    room?: CursorRoom;
    shouldRenderCursor?: (presence: CursorPresence) => boolean;
    getCursorStyle?: (presence: CursorPresence) => Partial<CSSStyleDeclaration> | Record<string, string>;
    /**
     * Where to mount cursor DOM and the cursor style tag. Defaults to
     * document.body / document.head. Pass a container you control (and mark
     * with transition:persist or equivalent) to survive SPA body-swaps.
     *
     * If the container has its own CSS transform (e.g. a pannable canvas
     * applies `transform: translate(...) scale(...)`), cursors are stored
     * AND rendered in the container's local coordinate space. The library
     * reads the live transform matrix from getComputedStyle, so two clients
     * with different pan/zoom agree on a cursor's content position; the
     * container's CSS transform then maps that position into each viewer's
     * own pixels — anchoring cursors to content rather than to the viewport.
     */
    container?: CursorContainer;
}

export { CursorPresence }

export { CursorPresenceView }

export declare type CursorRoom = "page" | "domain" | "section" | ((context: {
    domain: string;
    pathname: string;
    search: string;
}) => string);

export declare interface CursorZoneOptions {
    onCustomCursorRender?: (connectionId: string, element: HTMLElement) => HTMLElement | null;
    getCursorStyle?: (presence: CursorPresence) => Partial<CSSStyleDeclaration> | Record<string, string>;
}

declare type DeepReadonlyStore<T> = T extends (...args: any[]) => any ? T : T extends readonly (infer U)[] ? ReadonlyArray<DeepReadonlyStore<U>> : T extends object ? {
    readonly [K in keyof T]: DeepReadonlyStore<T[K]>;
} : T;

declare interface DefaultRoomOptions {
    includeSearch?: boolean;
}

/**
 * Registers a reusable capability under an attribute name (e.g. "can-note").
 * Every element carrying that attribute gets the capability — including ones
 * added to the DOM later. The imperative counterpart of
 * `init({ extraCapabilities })`.
 *
 * @param capabilityName - The attribute name elements use to opt in (used in an
 *   attribute selector, e.g. `[can-note]`).
 * @experimental New view API; signature may change in a future minor release.
 */
declare function definePlayCapability<T = any, U = any, V = any>(capabilityName: string, init: ElementInitializer<T, U, V>): void;

/**
 * Completely deletes all shared collaborative data for an element.
 * This is a destructive operation that removes data across all clients.
 * This includes:
 * - SyncedStore data (store.play[tag][elementId])
 * - Observer subscriptions
 * - Element handlers
 *
 * Use this when you want to permanently delete an element's data.
 * For just removing a DOM element while keeping data, use removePlayElement instead.
 *
 * @param tag - The capability tag (e.g., "can-move", "can-toggle")
 * @param elementId - The element ID
 */
declare function deleteElementData(tag: string, elementId: string): void;

declare function dispatchPlayEvent(message: EventMessage): void;

export declare type EditableStateLeafValue = string | number | boolean | null;

export { ElementAwarenessEventHandlerData }

declare type ElementDataWrite<T> = T | ((draft: T) => void);

declare class ElementHandler<T = any, U = any, V = any> {
    defaultData: T | undefined;
    localData: U;
    awareness: V[];
    awarenessByStableId: Map<string, V>;
    selfAwareness?: V;
    element: HTMLElement;
    _data: T;
    onChange: (data: T) => void;
    onAwarenessChange: (data: V) => void;
    debouncedOnChange: (data: T) => void;
    resetShortcut?: ModifierKey;
    updateElement?: (data: ElementEventHandlerData<T, U, V>) => void;
    view?: (data: ElementEventHandlerData<T, U, V>) => ViewTemplate;
    updateElementAwareness?: (data: ElementAwarenessEventHandlerData<T, U, V>) => void;
    triggerAwarenessUpdate?: () => void;
    devMode?: boolean;
    private isRendering;
    private onUnmount?;
    onAfterRender?: (element: HTMLElement) => void;
    private descendantObserver?;
    private dataUpdateListeners;
    private scheduleSetupDataWrite?;
    private clickListener?;
    private touchStartListener?;
    private mouseDownListener?;
    private resetShortcutListener?;
    private activeDragCleanup?;
    onClick?: (e: MouseEvent, eventData: ElementEventHandlerData<T, U, V>) => void;
    onDrag?: (e: MouseEvent | TouchEvent, eventData: ElementEventHandlerData<T, U, V>) => void;
    onDragStart?: (e: MouseEvent | TouchEvent, eventData: ElementEventHandlerData<T, U, V>) => void;
    constructor(elementData: ElementData<T>, options?: ElementHandlerOptions);
    /**
     * Tears down anything onMount set up (rAF loops, timers, listeners).
     * Called by removePlayElement / unregister(). Idempotent.
     */
    destroy(): void;
    reinitializeElementData({ element, onChange, onAwarenessChange, updateElement, view, updateElementAwareness, onClick, onDrag, onDragStart, resetShortcut, debounceMs, triggerAwarenessUpdate, devMode, }: ElementData<T>): void;
    setEventHandlers({ onClick, onDrag, onDragStart, }: Pick<ElementData<T>, "onClick" | "onDrag" | "onDragStart">): void;
    private removeActiveDragListeners;
    get data(): T;
    onDataUpdate(listener: () => void): () => void;
    setLocalData(localData: U | ((draft: U) => void)): void;
    /**
     * // PRIVATE USE ONLY \\
     *
     * Updates the internal state with the given data and handles all the downstream effects. Should only be used by the sync code to ensure one-way
     * reactivity.
     * (e.g. calling `updateElement`/`view` and `onChange`)
     */
    set __data(data: T);
    /**
     * Renders the element from current state: runs `view` and patches the
     * result into the DOM via lit-html, or falls back to imperative
     * `updateElement`. Safe to call repeatedly — lit-html diffs.
     */
    render(): void;
    /**
     * Begins binding capability descendants emitted by this view (mount points
     * for `define`d capabilities / `register`ed ids). Binds the current children
     * once, then re-binds only when the subtree's child structure changes — so a
     * text/attribute-only re-render (a ticking timer) does no scanning at all.
     * Called once by the runtime after `onAfterRender` is wired.
     */
    observeDescendants(): void;
    /**
     * Re-runs the view and repaints from current state. No-op for elements
     * without a `view` (it's the view-repaint primitive), and a no-op during an
     * in-flight render (calling it from inside `view` would recurse).
     */
    requestUpdate(): void;
    /** Warns and returns true if a write was attempted during a view render. */
    private rejectWriteDuringRender;
    updateAwareness(data: V[], byStableId: Map<string, V>): void;
    getEventHandlerData(): ElementEventHandlerData<T, U, V>;
    getAwarenessEventHandlerData(): ElementAwarenessEventHandlerData<T, U, V>;
    getSetupData(): ElementSetupData<T, U>;
    private setSetupData;
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
    setData(data: ElementDataWrite<T>): void;
    setMyAwareness(data: V): void;
    setDataDebounced(data: T): void;
    /**
     * Resets the element to its default state.
     */
    reset(): void;
}

declare interface ElementHandlerOptions {
    scheduleSetupDataWrite?: (write: () => void) => void;
}

export declare const elementHandlers: Map<string, Map<string, ElementHandler>>;

export { ElementInitializer }

export declare function formatStateLeafValue(value: EditableStateLeafValue): string;

export { getIdForElement }

export { html }

export declare interface InitOptions<T = unknown> {
    /**
     * The room to connect users to (this should be a string that matches the other users
     * that you want a given user to connect with).
     *
     * All rooms are automatically prefixed with their host (`window.location.hostname`) to prevent
     * conflicting with other people's sites.
     * Defaults to `window.location.pathname + window.location.search. You can customize this by
     * passing in your own room dynamically.
     *
     * Pass a function to make the room recompute on SPA navigation: it is called
     * at init and again on each route change, so a path-derived room follows the
     * URL the same way the default room does. A static string stays fixed for the
     * page's lifetime.
     */
    room?: string | (() => string);
    /**
     * Provide your own partykit host if you'd like to run your own server and customize the logic.
     */
    host?: string;
    /**
     * Optionally provide your own map of capabilities
     */
    extraCapabilities?: Record<string, ElementInitializer>;
    /**
     * A mapping of event types to PlayEvents. Allows specifying of imperative logic to trigger when a
     * client triggers some event. Automatically listens to native DOM events to trigger these.
     *
     */
    events?: Record<string, PlayEvent<T>>;
    /**
     * configuration for the default room which is based on the window's url
     */
    defaultRoomOptions?: DefaultRoomOptions;
    /**
     * Runs if playhtml fails to connect. Useful to show error messages and debugging.
     */
    onError?: () => void;
    /**
     * If true, will render some helpful development UI.
     */
    developmentMode?: boolean;
    /**
     * Cursor tracking and proximity detection configuration
     */
    cursors?: CursorOptions;
    /**
     * The local user's durable identity (name and color), available via
     * `playhtml.users` regardless of whether cursors are enabled. Defaults to a
     * persistent per-browser identity generated on first use.
     * `cursors.playerIdentity` is still honored and takes precedence over this
     * option, for back-compat.
     */
    playerIdentity?: PlayerIdentity;
}

declare function initPlayHTML(options?: InitOptions): Promise<void> | Promise<default_2>;

export declare function isEditableStateLeaf(value: unknown): value is EditableStateLeafValue;

declare type NamespaceListener = () => void;

export { nothing }

export { PageDataChannel }

export declare function parseStateLeafValue(input: string): StateLeafParseResult;

declare type PeerChannels = Record<string, unknown>;

/** Minimal message source the store subscribes to (the presence transport). */
declare type PeerMessageSource = {
    subscribe(listener: (message: PresenceServerMessage) => void): () => void;
};

/** Coarse channel groupings that consumers subscribe to. A consumer for one
 * namespace is only notified when a message actually touched that namespace, so
 * frame-rate cursor traffic never wakes element/presence subscribers. */
declare type PeerNamespace = "cursor" | "element" | "presence" | "identity";

/**
 * The single consumer of presence-sync / presence-changes on a socket. Folds
 * every channel into per-connection records, then dispatches only to the
 * namespaces a message touched. Views (cursor / element / presence) read the
 * folded peer map and shape their own output; they never parse raw messages.
 *
 * Subscribing replays the current snapshot immediately so late subscribers see
 * existing peer state instead of waiting for the next change.
 */
declare class PeerStore {
    private peers;
    private listeners;
    private unsubscribe;
    private sweepTimer;
    constructor(source: PeerMessageSource);
    /** The live folded peer map, keyed by connection id. Views read this. */
    getPeers(): Map<string, PeerChannels>;
    /**
     * Subscribe to a namespace. The callback fires whenever a message touched that
     * namespace, and once immediately with the current snapshot (replay). Returns
     * an unsubscribe function.
     */
    subscribe(namespace: PeerNamespace, listener: NamespaceListener): () => void;
    destroy(): void;
    private handleMessage;
    private applySync;
    private applyChanges;
    private notify;
    /** Periodic sweep for peers that went silent: prune expired channels and
     * notify only the namespaces that actually lost one (no-op when nothing
     * expired, so a quiet room never re-fires callbacks). */
    private sweepExpired;
    /**
     * Delete every peer channel whose stamped `at` has aged past the staleness
     * window, recording the touched namespaces into `touched`. Never removes a
     * peer wholesale for having only unstamped channels (identity persists) —
     * only prunes a now-empty peer row. Unstamped channels (identity) are always
     * live, so they are never swept. This is the single implementation of
     * client-side staleness for cursor, element, and presence views.
     */
    private pruneExpired;
}

/**
 * Handle returned by `playhtml.register`, and by `playhtml.getHandle` for any
 * bound element. Reads/writes resolve the live handler lazily, so a handle
 * obtained before the element binds still works once it does.
 *
 * @experimental Part of the new view API; subject to change in a future minor.
 */
export declare interface PlayElementHandle<T = any, U = any, V = any> {
    id: string;
    /** The bound DOM element, or null until it exists and binds. */
    getElement(): HTMLElement | null;
    /** Current shared data. Do not mutate it directly — mutations are not synced and may corrupt state; write via setData. */
    getData(): T | undefined;
    setData(next: T | ((draft: T) => void)): void;
    setLocalData(next: U | ((draft: U) => void)): void;
    setMyAwareness(next: V): void;
    /** Re-run the view now (for clock-driven views). No-op without a view. */
    requestUpdate(): void;
    /** Detach the handler (shared data is preserved) and drop the registration. */
    unregister(): void;
}

export { PlayerIdentity }

export declare const playhtml: PlayHTMLComponents;

export declare interface PlayHTMLComponents {
    init: typeof initPlayHTML;
    configure: typeof configurePlayHTML;
    readonly isLoading: boolean;
    readonly ready: Promise<void>;
    handleNavigation: () => Promise<void>;
    setupPlayElements: typeof setupElements;
    setupPlayElement: typeof setupPlayElement;
    removePlayElement: typeof removePlayElement;
    deleteElementData: typeof deleteElementData;
    setupPlayElementForTag: typeof setupPlayElementForTag;
    /** @experimental View API — register a custom element by id. */
    register: typeof registerPlayElement;
    /** @experimental View API — register a reusable capability by attribute name. */
    define: typeof definePlayCapability;
    /** @experimental View API — get a handle for a bound element. */
    getHandle: (elementId: string, tag?: string) => PlayElementHandle;
    syncedStore: ReadOnlyStore<PlayStore["play"]>;
    /** @deprecated Use getHandle(elementId, tag) to access a bound element. */
    elementHandlers: Map<string, Map<string, ElementHandler>>;
    dispatchPlayEvent: typeof dispatchPlayEvent;
    registerPlayEventListener: typeof registerPlayEventListener;
    removePlayEventListener: typeof removePlayEventListener;
    cursorClient: CursorClientAwareness | null;
    presence: PresenceAPI;
    users: Pick<UsersAPI, "me" | "getAll" | "onChange">;
    createPageData: typeof createPageData;
    createPresenceRoom: typeof createPresenceRoom;
    roomId: string;
    host: string;
    listSharedElements: () => Array<{
        type: "source" | "consumer";
        elementId: string;
        dataSource: string;
        normalized: string;
        permissions?: "read-only" | "read-write";
        element: HTMLElement;
    }>;
}

declare type PlayStore = {
    readonly play: Partial<Record<string, Record<string, unknown>>>;
};

/** Observability only — never gates behavior. "unreachable" means the socket
 * failed to open within the grace window / retry threshold; consumers keep
 * running (empty presence) rather than falling back. */
declare type PresenceConnectionState = "connecting" | "open" | "unreachable";

declare type PresenceJoinInput = {
    identity: PlayerIdentity;
    page?: string;
};

export { PresenceRoom }

declare type PresenceSocket = Pick<default_3, "readyState" | "send" | "close"> & Pick<EventTarget, "addEventListener" | "removeEventListener">;

declare type PresenceSocketFactory = (options: PartySocketOptions) => PresenceSocket;

declare type PresenceTransportListener = (message: PresenceServerMessage) => void;

declare type PresenceTransportOptions = {
    host: string;
    room: string;
    socketFactory?: PresenceSocketFactory;
};

export { PresenceView }

declare type ReadOnlyStore<T extends object> = DeepReadonlyStore<T>;

declare class RealtimePresenceTransport {
    private socket;
    private room;
    private listeners;
    private latestJoin;
    private channelValues;
    readonly peers: PeerStore;
    private _connectionState;
    private hasEverOpened;
    private failedReconnects;
    private unreachableLogged;
    private unreachableTimer;
    private lastControlLogAt;
    private usesHandlerProperties;
    private onMessage;
    private onOpen;
    private onCloseOrError;
    constructor(options: PresenceTransportOptions);
    /** Observability flag: whether the realtime socket is connecting, open, or
     * has been declared unreachable. Never gates behavior — for tests/debugging. */
    get connectionState(): PresenceConnectionState;
    private markUnreachable;
    /**
     * Base handling of server control messages, on EVERY socket (not just the
     * cursor client's). Consumers still layer their own reactions (e.g. the cursor
     * client's hz pacing) via subscribe(); this only guarantees rejections, the
     * channel cap, and force-close loops are never fully silent. Logging is
     * rate-limited per event type so a loop can't spam the console.
     */
    private handleControlMessage;
    private logControl;
    join(input: PresenceJoinInput): void;
    update(channel: string, value: unknown): void;
    clear(channel: string): void;
    subscribe(listener: PresenceTransportListener): () => void;
    destroy(): void;
    private flushCurrentState;
    private sendIfOpen;
    private isSocketOpen;
}

/**
 * Registers a `view`/`updateElement` initializer for a single element by id.
 * Callable before or after `init()` and before or after the element exists;
 * binding happens once both are present. Returns a handle for reads/writes
 * from outside the view (e.g. form submit handlers).
 *
 * @experimental New view API; signature may change in a future minor release.
 */
declare function registerPlayElement<T = any, U = any, V = any>(elementId: string, init: ElementInitializer<T, U, V>): PlayElementHandle<T, U, V>;

/**
 * Registers the given event listener.
 * Returns a unique ID corresponding to the listener.
 */
declare function registerPlayEventListener(type: string, event: Omit<PlayEvent, "type">): string;

/**
 * Removes the element handler for a DOM element from local state.
 * This unregisters the element but preserves all shared collaborative data.
 * Use this when a DOM element is removed/unmounted but you want to keep the data.
 *
 * @param element - The DOM element to unregister
 */
declare function removePlayElement(element: Element | null): void;

/**
 * Removes the event listener with the given type and id.
 */
declare function removePlayEventListener(type: string, id: string): void;

export { repeat }

export declare function replaceStateLeafValue<T>(data: T, path: StatePathSegment[], value: EditableStateLeafValue): StateLeafReplaceResult<T>;

/**
 * Full teardown of all playhtml state. Not part of the public API —
 * the singleton design means no single caller can safely own teardown
 * without reference counting. Exported as a named function for test
 * isolation (beforeEach resets) only.
 */
export declare function resetPlayHTML(): Promise<void>;

/**
 * Sets up any playhtml elements that are currently on the page.
 *
 * Should be called only once. If you'd like to set up new elements, use `setupPlayElement`, which is exposed
 * on the `playhtml` object on `window`.
 */
declare function setupElements(): void;

declare function setupPlayElement(element: Element, { ignoreIfAlreadySetup }?: {
    ignoreIfAlreadySetup?: boolean;
}): void;

/**
 * Sets up a playhtml element to handle the given tag's capabilities.
 */
declare function setupPlayElementForTag<T extends TagType | string>(element: HTMLElement, tag: T): Promise<void>;

declare type StateLeafParseResult = {
    ok: true;
    value: EditableStateLeafValue;
} | {
    ok: false;
    error: string;
};

declare type StateLeafReplaceResult<T> = {
    ok: true;
    data: T;
} | {
    ok: false;
    error: string;
};

export declare type StatePathSegment = string | number;

export { styleMap }

export { svg }

export { TagType }

export { TagTypeToElement }

export { User }

declare interface UsersAPI {
    readonly me: UsersSelfIdentity;
    getAll(): User[];
    onChange(callback: (users: User[]) => void): () => void;
    /** Adopts a whole new identity object (init option / configure() injection). */
    adoptIdentity(identity: PlayerIdentity): void;
    /** Returns the live identity reference (cursor client keeps reading this). */
    getIdentity(): PlayerIdentity;
    /** Subscribe to any self identity mutation (color/name/whole-identity). */
    onSelfChange(callback: (identity: PlayerIdentity) => void): () => void;
    destroy(): void;
}

declare interface UsersSelfIdentity {
    readonly pid: string;
    name: string | undefined;
    color: string;
}

export { }
