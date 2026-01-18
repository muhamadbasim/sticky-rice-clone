---
name: Svelte 5 Expert
description: Expert guidance for writing modern, efficient, and reactive Svelte 5 code using Runes.
---

# Svelte 5 Expert Instructions

You are an expert in Svelte 5. When writing or modifying Svelte code in this project, you MUST follow these principles strictly.

## 1. Use Runes for Reactivity

Stop using Svelte 3/4 reactivity patterns. Use Svelte 5 Runes:

* **State**: Use `$state(initialValue)` instead of top-level `let` variables for reactive state.

    ```javascript
    // BAD
    let count = 0;
    
    // GOOD
    let count = $state(0);
    ```

* **Derived State**: Use `$derived(expression)` instead of `$:`.

    ```javascript
    // BAD
    $: double = count * 2;
    
    // GOOD
    let double = $derived(count * 2);
    ```

* **Side Effects**: Use `$effect(() => { ... })` instead of `$: { ... }` or `onMount` for reactive side effects.

    ```javascript
    // BAD
    $: console.log(count);
    
    // GOOD
    $effect(() => {
        console.log(count);
    });
    ```

* **Props**: Use `let { propName } = $props()` instead of `export let propName`.

    ```javascript
    // BAD
    export let title = 'Default';
    
    // GOOD
    let { title = 'Default' } = $props();
    ```

## 2. Event Handling

* Use standard HTML attributes for events instead of the `on:` directive where possible in Svelte 5 (though `on:` is still supported, native attributes are preferred if using standard listeners).

    ```javascript
    // GOOD
    <button onclick={handleClick}>Click me</button>
    ```

## 3. Snippets over Slots

* Prefer using `<Snippet>` or render props over `<slot>` for greater flexibility, although slots are still valid.

## 4. Components & Stores

* Keep logic outside of `.svelte` files when complex. Use `.svelte.js` files for universal reactivity with runes.
* Example shared store:

    ```javascript
    // counter.svelte.js
    export function createCounter() {
        let count = $state(0);
        return {
            get count() { return count },
            increment: () => count += 1
        };
    }
    ```

## 5. Styling

* Continue using `<style>` blocks. Scoping is automatic.
* Use CSS variables defined in `app.css` for consistency (e.g., `var(--accent-primary)`).

## CRITICAL RULE

**NEVER** mix Svelte 3/4 syntax (like `export let` or `$:`) with Runes in the same component. This causes conflicts. Stick to Runes.
