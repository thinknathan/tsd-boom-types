/// <reference types="@typescript-to-lua/language-extensions" />
/// <reference types="@ts-defold/types" />

/** @noSelfInFile */

declare type BoomCallback = () => void;
declare type BoomCancelEvent = () => void;

//
// Start
//

/**
 * @url https://github.com/britzl/boom/
 * @noResolution
 */
declare module 'boom.boom' {
	/**
	 * Start a boom game. Call this from your own game script
	 * @param game Game loop function
	 */
	export function boom(game: () => void): void;
}

//
// Game Obj
//

/**
 * A Game Object that may have components added.
 */
declare type BoomGameObject = BoomBlankGameObject & Partial<BoomComponent>;
declare type BoomGameObjectSet = LuaSet<BoomGameObject>;

/**
 * A Game Object without components.
 */
interface BoomBlankGameObject {
	/**
	 * Add a game object as a child of this game object.
	 * @param comps The game object components
	 * @returns The game object
	 */
	add(comps: BoomComponentSet): BoomGameObject;

	/**
	 * Destroy this game object
	 */
	destroy(): void;

	/**
	 * Check if there is a certain tag on this game object.
	 * @param tag The tag to check
	 * @returns Returns true if the tag exists on the game object
	 */
	is(tag: string): boolean;

	/**
	 * Add a component to this game object.
	 * @param comp The component to use
	 */
	use(comp: object): void;

	/**
	 * Remove a component from this game object.
	 * @param tag The component tag to remove
	 */
	unuse(tag: string): void;

	/**
	 * Get state for a specific component on this game object.
	 * @param tag The component to get state for
	 * @returns The component state
	 */
	c(tag: string): object;

	readonly dirty: boolean;
	readonly children: LuaMap;
	readonly comps: LuaMap<string | number, LuaMap<string, unknown>>;
	readonly properties: LuaMap<string, unknown>;
	readonly id: hash;
	readonly ids: LuaMap<hash, hash>;
	readonly tags: LuaMap<string | hash, boolean>;
	// pre_update: LuaSet<Function>;
	// update: LuaSet<Function>;
	// post_update: LuaSet<Function>;
}

/**
 * Add a game object with a set of components.
 * @param comps The components for the game object
 * @returns The created game object
 */
declare function add(comps: BoomComponentSet): BoomGameObject;

/**
 * Destroy a game object and all of its components.
 * @param object The object to destroy
 */
declare function destroy(object: BoomGameObject): void;

/**
 * Destroy all objects with a certain tag.
 * @param tag The tag to destroy or undefined to destroy all objects
 */
declare function destroy_all(tag?: string): void;

/**
 * Get game object with specific id.
 * @param id
 * @returns The object or undefined if it doesn't exist
 */
declare function object(id: string): BoomGameObject | undefined;

/**
 * Get all game objects.
 * @returns All game objects
 */
declare function objects(): BoomGameObjectSet;

/**
 * Get all game objects with the specified tag.
 * @param tag The tag to get objects for, undefined to get all objects
 * @returns List of objects
 */
declare function get(tag?: string): BoomGameObjectSet;

/**
 * Run callback on every object with a certain tag.
 * @param tag The tag that must exist on the object
 * @param cb The callback to run
 */
declare function every(tag: string, cb: (object: BoomGameObject) => void): void;

//
// Components
//

declare type BoomComponentSet = BoomComponent[] | LuaSet<BoomComponent>;
declare type BoomComponent =
	| Anchor
	| AreaComp
	| BodyComp
	| ColorComp
	| DoubleJumpComp
	| FadeInComp
	| Fixed
	| HealthComp
	| Lifespan
	| Move
	| Offscreen
	| Opacity
	| Pos
	| Rotate
	| Scale
	| Sprite
	| Stay
	| Text
	| Timer
	| Z;

interface Anchor {
	readonly tag: 'anchor';
}

interface AreaComp {
	readonly tag: 'area';
	/**
	 * Get all collisions currently happening for this component.
	 * @returns List of collisions
	 */
	get_collisions(): Collision[] | LuaSet<Collision>;
	/**
	 * Check collision between this component and another object.
	 * @param other_object The game object to check collisions with.
	 * @returns boolean (Return true if colliding with the other object), Collision data
	 */
	check_collision(
		other_object: BoomGameObject
	): LuaMultiReturn<[boolean, Collision]>;
	/**
	 * Register event listener when this component is colliding.
	 * @param tag Optional tag which colliding object must have, undefined for all collisions
	 * @param cb Function to call when collision is detected
	 */
	on_collide(tag: string | undefined, cb: BoomCallback): void;
	/**
	 * Register event listener when this component is clicked.
	 * @param cb Function to call when clicked
	 */
	on_click(cb: BoomCallback): void;
	/**
	 * Check if a point is within the area of this component.
	 * @param point The point to check
	 * @returns boolean Will return true if point is within area
	 */
	has_point(point: undefined): boolean;

	// update: Function;
	// destroy: Function;
	// init: Function;
	// pre_update: Function;
}

interface BodyComp {
	readonly tag: 'body';
	/**
	 * Add upward force
	 * @param force The upward force to apply
	 */
	jump(force: number): void;
	readonly is_jumping: boolean;
	readonly is_grounded: boolean;
	readonly is_falling: boolean;
	readonly is_static: boolean;
	readonly jump_force: number;

	// update: Function;
	// destroy: Function;
	// init: Function;
	// pre_update: Function;
}

interface ColorComp {
	readonly tag: 'color';
	/**
	 * Functions for modifying color.
	 */
	readonly color: {
		/**
		 * Darkens the Color.
		 * @param n Amount to darken color by
		 */
		darken: (n: number) => ColorComp;
		/**
		 * Invert the Color.
		 */
		invert: () => ColorComp;
		/**
		 * Clone the Color.
		 */
		clone: () => ColorComp;
		/**
		 * Lighten the Color.
		 * @param n Amount to lighten color by
		 */
		lighten: (n: number) => ColorComp;
	};
}

interface DoubleJumpComp {
	readonly tag: 'double_jump';
	/**
	 * Performs double jump (the initial jump only happens if player is grounded).
	 * @param force The upward force to apply
	 */
	double_jump(force: number): void;
	readonly num_jumps: number;

	// init: Function;
}

interface FadeInComp {
	readonly tag: 'fadein';

	// init: Function;
}

interface Fixed {
	readonly tag: 'fixed';
}

interface HealthComp {
	readonly tag: 'health';
	/**
	 * Register an event that runs when heal() is called.
	 * @param cb Function to call
	 */
	on_heal(cb: BoomCallback): void;
	/**
	 * Register an event that runs when hurt() is called.
	 * @param cb Function to call
	 */
	on_hurt(cb: BoomCallback): void;
	/**
	 * Register an event that runs when health is 0 or less.
	 * @param cb Function to call
	 */
	on_death(cb: BoomCallback): void;
	/**
	 * Increase hp. Will trigger on_heal.
	 * @param n Amount to increase
	 */
	heal(n: number): void;
	/**
	 * Decrease hp. Will trigger on_hurt
	 * @param n Amount to decrease
	 */
	hurt(n: number): void;

	// destroy: Function;
}

interface Lifespan {
	readonly tag: 'lifespan';

	// init: Function;
}

interface Move {
	readonly tag: 'move';

	// update: Function;
	// init: Function;
}

interface Offscreen {
	readonly tag: 'offscreen';
	/**
	 * Register a callback that runs when the object goes out of view
	 * @param cb Function to call when the object goes out of view
	 */
	on_exit_screen(cb: BoomCallback): void;
	/**
	 * Register a callback that runs when the object enters view
	 * @param cb Function to call when the object enters view
	 */
	on_enter_screen(cb: BoomCallback): void;
	readonly is_offscreen: boolean;

	// update: Function;
	// init: Function;
	// destroy: Function;
}

interface Opacity {
	readonly tag: 'opacity';
}

interface Pos {
	readonly tag: 'pos';
	/**
	 * Move a number of pixels per second.
	 * @param x
	 * @param y
	 */
	move(x: number, y: number): void;
	readonly vel: Vec2;
	readonly pos: Vec2;

	// update: Function;
	// init: Function;
}

interface Rotate {
	readonly tag: 'rotate';

	/**
	 * Updates rotation
	 * @param angle in degrees
	 */
	rotate: (angle: number) => void;

	// init: Function;
}

interface Scale {
	readonly tag: 'scale';

	/**
	 * Rescales object
	 * @param x
	 * @param y defaults to x
	 */
	scale_to: (x: number, y?: number) => void;
	readonly scale: vmath.vector3;
}

interface Sprite {
	readonly tag: 'sprite';
	/**
	 * Play an animation
	 * @param anim The animation to play
	 */
	play(anim: string): void;
	/**
	 * Stop the current animation
	 */
	stop(): void;
	readonly height: number;
	readonly width: number;

	// init: Function;
	// pre_update: Function;
	// destroy: Function;
	// update: Function;
}

interface Stay {
	readonly tag: 'stay';
}

interface Text {
	readonly tag: 'text';

	// init: Function;
	// destroy: Function;
	// update: Function;
}

interface Timer {
	readonly tag: 'timer';
	/**
	 * Run a callback function after n seconds
	 * @param n Seconds
	 * @param fn The function to call
	 */
	wait(n: number, fn: BoomCallback): void;
	/**
	 * Run a callback function every n seconds
	 * @param n Seconds
	 * @param fn The function to call
	 */
	loop(n: number, fn: BoomCallback): void;
	/**
	 * Cancel the timer
	 */
	cancel(): void;

	// destroy: Function;
	// init: Function;
}

interface Z {
	readonly tag: 'z';
}

/**
 * Anchor point for render.
 * @param anchor Anchor (center, topleft, left, topright, right, bottomright, bottom, bottomleft)
 * @return The anchor component.
 */
declare function anchor(
	anchor:
		| 'center'
		| 'topleft'
		| 'left'
		| 'topright'
		| 'right'
		| 'bottomright'
		| 'bottom'
		| 'bottomleft'
): Anchor;

/**
 * Create a collider area and enable collision detection. This will create an area component which is used to describe an area which can collide with other area components.
 * @param options Component options (shape, width, height, radius)
 * @returns The area component
 */
declare function area(options?: {
	width?: number;
	height?: number;
	radius?: number;
	shape?: 'auto' | 'rect' | 'circle' | 'auto-circle';
}): AreaComp;

/**
 * Physical body that responds to gravity. Requires AreaComp and PosComp components on the game object. This also makes the object solid.
 * @param options Component options (jump_force, is_static)
 * @returns The body component
 */
declare function body(options?: {
	jump_force?: number;
	is_static?: boolean;
}): BodyComp;

/**
 * Control the color of the game object.
 * @param r Red
 * @param g Green
 * @param b Blue
 * @param a Optional alpha
 * @returns The color component
 */
declare function color(
	r?: number,
	g?: number,
	b?: number,
	a?: number
): ColorComp;

/**
 * Enables double jump. Requires body component.
 * @param options Component options
 * @returns The double jump component
 */
declare function double_jump(options?: { num_jumps?: number }): DoubleJumpComp;

/**
 * Fade in game object visual components such as sprites.
 * @param time In seconds
 * @returns The fade in component.
 */
declare function fadein(time?: number): FadeInComp;

/**
 * Make object unaffected by camera.
 * @returns The component
 */
declare function fixed(): Fixed;

/**
 * Add health related logic to game object.
 * @param hp Initial health
 * @returns The health component
 */
declare function health(hp?: number): HealthComp;

/**
 * Destroy the game object after certain amount of time.
 * @param time In seconds
 * @param options Fade out duration (default 0 which is no fade out).
 */
declare function lifespan(time: number, options?: { fade?: number }): Lifespan;

/**
 * Move a game object in a direction of travel and at a specific speed.
 * @param direction Direction of movement.
 * @param speed Speed of movement in pixels per second.
 * @returns The created component.
 */
declare function move(direction?: Vec2, speed?: number): Move;

/**
 * Control the behavior of a game object when it goes out of view.
 * @param options Destroy when going offscreen
 * @returns The created component
 */
declare function offscreen(options?: {
	distance?: number;
	destroy?: boolean;
}): Offscreen;

/**
 * Control the opacity of a game object.
 * @param value The opacity from 0.0 to 1.0
 * @returns The created component
 */
declare function opacity(value?: number): Opacity;

/**
 * Control the position of a game object.
 * @param x
 * @param y
 * @returns The created component
 */
declare function pos(x: number, y: number): Pos;

/**
 * Apply rotation to the object.
 * @param angle
 * @returns The component
 */
declare function rotate(angle?: number): Rotate;

/**
 * Apply a scale to the object.
 * @param x defaults to 1
 * @param y defaults to x
 * @returns The component
 */
declare function scale(x?: number, y?: number): Scale;

/**
 * Render a sprite.
 * @param sheet
 * @param animations
 */
declare function sprite(
	anim?: string,
	options?: {
		atlas?: string | hash;
		flip_x?: boolean;
		flip_y?: boolean;
		width?: number;
		height?: number;
	}
): Sprite;

/**
 * Do not get destroyed on scene switch.
 * @returns The created component
 */
declare function stay(): Stay;

/**
 * Render text.
 * @param content The text to show
 * @param options Text options (width, font, align)
 * @returns The created component
 */
declare function text(
	text?: string,
	options?: {
		font?: string;
		align?: 'left' | 'right' | 'center';
		width?: number;
	}
): Text;

/**
 * Run certain action after some time.
 * @param n Number of seconds to wait
 * @param fn The function to call
 * @returns The created component
 */
declare function timer(n?: number, fn?: BoomCallback): Timer;

/**
 * Determines the draw order for objects. Object will be drawn on top if z value is bigger.
 * @param index Z-value of the object.
 * @returns The created component
 */
declare function z(index?: number): Z;

//
// Events
//

/**
 * Register an event that runs when two game objects collide.
 * @param tag1 Tag which the first game object must have
 * @param tag2 Optional tag which the second game object must have
 * @param fn Will receive (collision, cancel) as args
 * @returns Cancel event function
 */
declare function on_collide(
	tag1: string,
	tag2: string | undefined,
	fn: (collision: Collision, cancel: BoomCancelEvent) => void
): BoomCancelEvent;

// TO-DO: Document collision
interface Collision {}

/**
 * Register callback that runs when a certain key is pressed.
 * @param key_id The key that must be pressed or undefined for any key
 * @param cb The callback
 * @returns Cancel callback
 */
declare function on_key_press(
	key_id: string | undefined,
	cb: BoomCallback
): BoomCancelEvent;

/**
 * Register callback that runs when a certain key is released.
 * @param key_id The key that must be released or undefined for any key
 * @param cb The callback
 * @returns Cancel callback
 */
declare function on_key_release(
	key_id: string | undefined,
	cb: BoomCallback
): BoomCancelEvent;

/**
 * Set mouse click listener.
 * @param tag Optional click on object with tag filter
 * @param cb Callback when mouse button is clicked
 * @returns Cancel listener function
 */
declare function on_click(
	tag: string | undefined,
	cb: BoomCallback
): BoomCancelEvent;

/**
 * Register callback that runs when left mouse button is pressed.
 * @param cb
 * @returns Cancel callback
 */
declare function on_mouse_press(cb: BoomCallback): BoomCancelEvent;

/**
 * Register callback that runs when left mouse button is released.
 * @param cb
 * @returns Cancel callback
 */
declare function on_mouse_release(cb: BoomCallback): BoomCancelEvent;

/**
 * Register callback that runs when the mouse is moved.
 * @param cb
 * @returns Cancel callback
 */
declare function on_mouse_move(cb: BoomCallback): BoomCancelEvent;

/**
 * Run a function every frame. Register an event that runs every frame, optionally for all game objects with certain tag
 * @param tag Run event for all objects matching tag (optional)
 * @param fn The event function to call. Will receive object and cancel function.
 */
declare function on_update(
	tag: string | undefined,
	fn: (
		object: BoomGameObject,
		cancel: (object: BoomGameObject, cancel: BoomCancelEvent) => void
	) => void
): void;

//
// Level
//

declare type BoomTiles =
	| {
			[key: string]: () => BoomComponentSet;
	  }
	| LuaMap<string, () => BoomComponentSet>;

/**
 * Construct a level based on symbols.
 * @param map List of strings presenting horizontal rows of tiles
 * @param options Level options (tile_width, tile_height, pos, tiles)
 * @returns Game object with tiles as children
 */
declare function add_level(
	map: string[] | LuaSet<string>,
	options: {
		tile_width?: number;
		tile_height?: number;
		pos?: Vec2;
		tiles?: BoomTiles;
	}
): BoomGameObject;

//
// Math
//

declare type Vec2 = {
	x: number;
	y: number;
	readonly z: 0;
	readonly __type: vmath.vector3;
	/**
	 * Get distance between another vector.
	 */
	dist: (compare: Vec2) => number;
};

/**
 * Get a random number. If called with no arguments the function returns a number between 0 and 1. If called with a single argument 'a' a number between 0 and 'a' is returned. If called with two arguments 'a' and 'b' a number between 'a' and 'b' is returned.
 * @param a
 * @param b
 * @returns Float number
 */
declare function rand(a?: number, b?: number): number;

/**
 * Same as rand() but floored. If called with two arguments 'a' and 'b' a number between 'a' and 'b' is returned.
 * @param a
 * @param b
 * @returns Integer number
 */
declare function randi(a?: number, b?: number): number;

/**
 * Create a Color.
 * @param r Red component (0.0 to 1.0)
 * @param g Green component (0.0 to 1.0)
 * @param b Blue component (0.0 to 1.0)
 * @param a Alpha component (0.0 to 1.0)
 * @returns The created color.
 */
declare function rgb(r?: number, g?: number, b?: number, a?: number): ColorComp;

declare namespace rgb {
	/**
	 * Red color. (1, 0, 0, 1)
	 */
	export const RED: ColorComp;
	/**
	 * Green color. (0, 1, 0, 1)
	 */
	export const GREEN: ColorComp;
	/**
	 * Blue color. (0, 0, 1, 1)
	 */
	export const BLUE: ColorComp;
	/**
	 * Black color. (0, 0, 0, 1)
	 */
	export const BLACK: ColorComp;
	/**
	 * White color. (1, 1, 1, 1)
	 */
	export const WHITE: ColorComp;
	/**
	 * Create Color from a hex string.
	 * @param hex Hex string in RGB, RGBA, RRGGBB or RRGGBBAA format (with optional initial #).
	 * @returns The created color.
	 */
	export function from_hex(hex: string): ColorComp;
}

/**
 * Tween a value from one to another. The transition will happen over a certain duration using a specific easing function.
 * @param from Start value
 * @param to End value
 * @param duration Time in seconds to go from start to end value
 * @param easing Which easing algorithm to use (default EASING_LINEAR)
 * @param set_value Function to call when the value has changed
 * @returns A tween object.
 */
declare function tween(
	from: number | Vec2,
	to: number | Vec2,
	duration: number,
	easing: string | undefined,
	set_value: (endValue: number | Vec2) => void
): Tween;

interface Tween {
	/**
	 * Register an event when finished
	 * @param fn The function to call when the tween has finished
	 */
	on_end(fn: BoomCallback): void;
	/**
	 * Finish tween now.
	 */
	finish(): void;
	/**
	 * Cancel tween.
	 */
	cancel(): void;
}

/**
 * Create a Vec2
 * @param x Horizontal position
 * @param y Vertical position
 * @returns The created Vec2
 */
declare function vec2(x?: number, y?: number): Vec2;

/**
 * When vec2 is called as an object instead of as a function.
 */
declare namespace vec2 {
	/**
	 * UP vector (0, 1)
	 */
	const UP: Vec2;
	/**
	 * RIGHT vector (1, 0)
	 */
	const RIGHT: Vec2;
	/**
	 * DOWN vector (0, -1)
	 */
	const DOWN: Vec2;
	/**
	 * DOWN vector (-1, 0)
	 */
	const LEFT: Vec2;
}

//
// Scene
//

/**
 * Create a scene.
 * @param id Unique id of the scene
 * @param fn The scene code
 */
declare function scene(id: string, fn: (...args: unknown[]) => void): void;

/**
 * Show a scene.
 * @param id Id of the scene to show
 * @param args Additional arguments to pass to the scene function
 */
declare function show(id: string, ...args: unknown[]): void;

//
// Timer
//

/**
 * Run a callback after a certain number of seconds.
 * @param seconds Number of seconds to wait
 * @param cb Function to call
 * @returns Call to cancel the timer
 */
declare function wait(seconds: number, cb: BoomCallback): BoomCancelEvent;

/**
 * Run a callback repeatedly with a certain interval
 * @param seconds Interval between calls
 * @param cb Function to call
 * @returns Call to cancel the timer
 */
declare function loop(seconds: number, cb: BoomCallback): BoomCancelEvent;

//
// Info
//

/**
 * Check if a certain key is down.
 * @param key_id The key that must be down, or undefined for any key
 * @returns True if down
 */
declare function is_key_down(key_id?: string): boolean;

/**
 * Get mouse position (screen coordinates).
 * @returns Mouse position
 */
declare function mouse_pos(): Vec2;

/**
 * Get or set camera position.
 * @param x
 * @param y
 * @returns Camera position
 */
declare function cam_pos(x?: number | Vec2, y?: number): Vec2;

/**
 * Get or set camera rotation.
 * @param angle The angle to set or undefined to get current rotation
 * @returns The camera rotation in degrees
 */
declare function cam_rot(angle?: number): number;

/**
 * Get or set the camera zoom.
 * @param zoom The zoom to set or undefined to get the current zoom.
 * @returns The camera zoom
 */
declare function cam_zoom(zoom?: number): number;

/**
 * Get gravity
 * @returns The gravity in pixels per seconds
 */
declare function get_gravity(): number;

/**
 * Set gravity
 * @param gravity Gravity in pixels per seconds
 */
declare function set_gravity(gravity: number): void;

/**
 * Get screen width
 * @returns Width of screen
 */
declare function width(): number;

/**
 * Get screen height
 * @returns Height of screen
 */
declare function height(): number;

/**
 * Get screen center position
 * @returns Center of screen
 */
declare function center(): Vec2;

/**
 * Get the delta time
 * @returns Delta time
 */
declare function dt(): number;

/**
 * Get time since start
 * @returns Time since start in seconds
 */
declare function time(): number;
