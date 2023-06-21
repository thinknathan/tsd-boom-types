/// <reference types="@typescript-to-lua/language-extensions" />
/// <reference types="@ts-defold/types" />

/** @noSelfInFile */

//
// Start
//

/**
 * Start a boom game. Call this from your own game script
 * @param game Game loop function
 */
declare type Boom = (game: () => void) => void;

//
// Game Obj
//

interface GameObject {
	/**
	 * Add a game object as a child of this game object.
	 * @param comps The game object components
	 * @returns The game object
	 */
	add(comps: Component[] | LuaSet<Component>): GameObject;

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

	dirty: boolean;
	children: object | LuaTable;
	comps: object | LuaTable;
	properties: object | LuaTable;
	id: hash;
	ids: object | LuaTable;
	tags: object | LuaTable;
	// pre_update: unknown;
	// update: unknown;
	// post_update: unknown;
}

/**
 * Add a game object with a set of components.
 * @param comps The components for the game object
 * @returns The created game object
 */
declare function add(comps: Component[] | LuaSet<Component>): GameObject;

/**
 * Destroy a game object and all of its components.
 * @param object The object to destroy
 */
declare function destroy(object: GameObject): void;

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
declare function object(id: string): GameObject | undefined;

/**
 * Get all game objects.
 * @returns All game objects
 */
declare function objects(): GameObject[] | LuaSet<GameObject>;

/**
 * Get all game objects with the specified tag.
 * @param tag The tag to get objects for, undefined to get all objects
 * @returns List of objects
 */
declare function get(tag?: string): GameObject[] | LuaSet<GameObject>;

/**
 * Run callback on every object with a certain tag.
 * @param tag The tag that must exist on the object
 * @param cb The callback to run
 */
declare function every(tag: string, cb: (object: GameObject) => void): void;

//
// Components
//

interface Anchor {
	tag: 'anchor';
}

interface AreaComp {
	tag: 'area';
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
		other_object: GameObject
	): LuaMultiReturn<[boolean, Collision]>;
	/**
	 * Register event listener when this component is colliding.
	 * @param tag Optional tag which colliding object must have, undefined for all collisions
	 * @param cb Function to call when collision is detected
	 */
	on_collide(tag: string | undefined, cb: () => void): void;
	/**
	 * Register event listener when this component is clicked.
	 * @param cb Function to call when clicked
	 */
	on_click(cb: () => void): void;
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
	tag: 'body';
	/**
	 * Add upward force
	 * @param force The upward force to apply
	 */
	jump(force: number): void;
	is_jumping: boolean;
	is_grounded: boolean;
	is_falling: boolean;
	is_static: boolean;
	jump_force: number;

	// update: Function;
	// destroy: Function;
	// init: Function;
	// pre_update: Function;
}

interface ColorComp {
	tag: 'color';
	/**
	 * Functions for modifying color.
	 */
	color: {
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
	tag: 'double_jump';
	/**
	 * Performs double jump (the initial jump only happens if player is grounded).
	 * @param force The upward force to apply
	 */
	double_jump(force: number): void;
	num_jumps: number;

	// init: Function;
}

interface FadeInComp {
	tag: 'fadein';

	// init: Function;
}

interface Fixed {
	tag: 'fixed';
}

interface HealthComp {
	tag: 'health';
	/**
	 * Register an event that runs when heal() is called.
	 * @param cb Function to call
	 */
	on_heal(cb: () => void): void;
	/**
	 * Register an event that runs when hurt() is called.
	 * @param cb Function to call
	 */
	on_hurt(cb: () => void): void;
	/**
	 * Register an event that runs when health is 0 or less.
	 * @param cb Function to call
	 */
	on_death(cb: () => void): void;
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
	tag: 'lifespan';

	// init: Function;
}

interface Move {
	tag: 'move';

	// update: Function;
	// init: Function;
}

interface Offscreen {
	tag: 'offscreen';
	/**
	 * Register a callback that runs when the object goes out of view
	 * @param cb Function to call when the object goes out of view
	 */
	on_exit_screen(cb: () => void): void;
	/**
	 * Register a callback that runs when the object enters view
	 * @param cb Function to call when the object enters view
	 */
	on_enter_screen(cb: () => void): void;
	is_offscreen: boolean;

	// update: Function;
	// init: Function;
	// destroy: Function;
}

interface Opacity {
	tag: 'opacity';
}

interface Pos {
	tag: 'pos';
	/**
	 * Move a number of pixels per second.
	 * @param x
	 * @param y
	 */
	move(x: number, y: number): void;
	// TO-DO: document function
	vel: { dist: Function };
	// TO-DO: document function
	pos: { dist: Function };

	// update: Function;
	// init: Function;
}

interface Rotate {
	tag: 'rotate';
	// TO-DO: document function
	rotate: Function;

	// init: Function;
}

interface Scale {
	tag: 'scale';
	// TO-DO: document function
	scale_to: Function;
	scale: vmath.vector3;
}

interface Sprite {
	tag: 'sprite';
	/**
	 * Play an animation
	 * @param anim The animation to play
	 */
	play(anim: string): void;
	/**
	 * Stop the current animation
	 */
	stop(): void;
	height: number;
	width: number;

	// init: Function;
	// pre_update: Function;
	// destroy: Function;
	// update: Function;
}

interface Stay {
	tag: 'stay';
}

interface Text {
	tag: 'text';

	// init: Function;
	// destroy: Function;
	// update: Function;
}

interface Timer {
	tag: 'timer';
	/**
	 * Run a callback function after n seconds
	 * @param n Seconds
	 * @param fn The function to call
	 */
	wait(n: number, fn: () => void): void;
	/**
	 * Run a callback function every n seconds
	 * @param n Seconds
	 * @param fn The function to call
	 */
	loop(n: number, fn: () => void): void;
	/**
	 * Cancel the timer
	 */
	cancel(): void;

	// destroy: Function;
	// init: Function;
}

interface Z {
	tag: 'z';
}

type Component =
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
 * Create a collider area and enabled collision detection. This will create an area component which is used to describe an area which can collide with other area components.
 * @param options Component options (width and height)
 * @returns The area component
 */
declare function area(options?: { width?: number; height?: number }): AreaComp;

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
 * Create a color component
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
 * Enables double jump. Requires body component
 * @param options Component options
 * @returns The double jump component
 */
declare function double_jump(options?: { num_jumps?: number }): DoubleJumpComp;

/**
 * Fade object in.
 * @param time In seconds
 * @returns The fade in component.
 */
declare function fadein(time?: number): FadeInComp;

/**
 * Create a fixed component
 * @returns The component
 */
declare function fixed(): Fixed;

/**
 * Create a health component
 * @param hp Initial health
 * @returns The health component
 */
declare function health(hp?: number): HealthComp;

/**
 * Create a Lifespan component.
 * @param time In seconds
 * @param options Fade out duration (default 0 which is no fade out).
 */
declare function lifespan(time: number, options?: { fade?: number }): Lifespan;

/**
 * Create a move component.
 * @param direction Direction of movement.
 * @param speed Speed of movement in pixels per second.
 * @returns The created component.
 */
declare function move(direction?: Vec2, speed?: number): Move;

/**
 * Create an offscreen component.
 * @param options Destroy when going offscreen
 * @returns The created component
 */
declare function offscreen(options?: {
	distance?: number;
	destroy?: boolean;
}): Offscreen;

/**
 * Create an opacity component.
 * @param value The opacity from 0.0 to 1.0
 * @returns The created component
 */
declare function opacity(value?: NumberBetweenZeroAndOne): Opacity;
type NumberBetweenZeroAndOne = number & {
	readonly __numberBetweenZeroAndOne: unique symbol;
};

/**
 * Create a position component.
 * @param x
 * @param y
 * @returns The created component
 */
declare function pos(x: number, y: number): Pos;

/**
 * Apply rotation to object
 * @param angle
 * @returns The component
 */
declare function rotate(angle?: number): Rotate;

/**
 * Apply a scale to the object
 * @param x
 * @param y
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
declare function timer(n?: number, fn?: () => void): Timer;

/**
 * Determines the draw order for objects. Object will be drawn on top if z value is bigger.
 * @param index Z-value of the object.
 * @returns The created component
 */
declare function z(index?: number): Z;

//
// Events
//

declare type EventCancel = () => void;
declare type EventCallback = () => void;

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
	fn: (collision: Collision, cancel: EventCancel) => void
): EventCancel;

// TO-DO: Document collision
interface Collision {}

/**
 * Set mouse click listener.
 * @param tag Optional click on object with tag filter
 * @param cb Callback when mouse button is clicked
 * @returns Cancel listener function
 */
declare function on_click(
	tag: string | undefined,
	cb: EventCallback
): EventCancel;

/**
 * Register callback that runs when left mouse button is pressed.
 * @param cb
 * @returns Cancel callback
 */
declare function on_mouse_press(cb: EventCallback): EventCancel;

/**
 * Register callback that runs when left mouse button is released.
 * @param cb
 * @returns Cancel callback
 */
declare function on_mouse_release(cb: EventCallback): EventCancel;

/**
 * Register callback that runs when the mouse is moved.
 * @param cb
 * @returns Cancel callback
 */
declare function on_mouse_move(cb: EventCallback): EventCancel;

/**
 * Register callback that runs when a certain key is pressed.
 * @param key_id The key that must be pressed or undefined for any key
 * @param cb The callback
 * @returns Cancel callback
 */
declare function on_key_press(
	key_id: string | undefined,
	cb: EventCallback
): EventCancel;

/**
 * Register callback that runs when a certain key is released.
 * @param key_id The key that must be released or undefined for any key
 * @param cb The callback
 * @returns Cancel callback
 */
declare function on_key_release(
	key_id: string | undefined,
	cb: EventCallback
): EventCancel;

/**
 * Run a function every frame. Register an event that runs every frame, optionally for all game objects with certain tag
 * @param tag Run event for all objects matching tag (optional)
 * @param fn The event function to call. Will receive object and cancel function.
 */
declare function on_update(
	tag: string | undefined,
	fn: (
		object: GameObject,
		cancel: (object: GameObject, cancel: EventCancel) => void
	) => void
): void;

//
// Level
//

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
		tiles?: {
			[key: string]: () => Component[] | LuaSet<Component>;
		};
	}
): GameObject;

//
// Math
//

/**
 * Get a random number. If called with no arguments the function returns a number between 0 and 1. If called with a single argument 'a' a number between 0 and 'a' is returned. If called with two arguments 'a' and 'b' a number between 'a' and 'b' is returned.
 * @param a
 * @param b
 * @returns Float number
 */
declare function rand(a?: number, b?: number): number;

/**
 * Same as rand() but floored.
 * @param a
 * @param b
 * @returns Integer number
 */
declare function randi(a?: number, b?: number): number;

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
	on_end(fn: () => void): void;
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
	 * Vec2(0, 1)
	 */
	const UP: Vec2;
	/**
	 * Vec2(0, -1)
	 */
	const DOWN: Vec2;
	/**
	 * Vec2(-1, 0)
	 */
	const LEFT: Vec2;
	/**
	 * Vec2(1, 0)
	 */
	const RIGHT: Vec2;
	/**
	 * Get distance between another vector.
	 */
	function dist(compare: Vec2): number;
}

/**
 * A 2D vector based on vmath.vec3. Z is always 0.
 */
interface Vec2 {
	x: number;
	y: number;
	readonly z: 0;
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
 * Run a callback after a certain nummber of seconds.
 * @param seconds Number of seconds to wait
 * @param cb Function to call
 * @returns Call to cancel the timer
 */
declare function wait(seconds: number, cb: () => void): () => any;

/**
 * Run a callback repeatedly with a certain interval
 * @param seconds Interval between calls
 * @param cb Function to call
 * @returns Call to cancel the timer
 */
declare function loop(seconds: number, cb: () => void): () => any;

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
