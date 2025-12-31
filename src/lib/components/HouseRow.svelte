<script lang="ts">
    import { calcMaterials } from "../housing/calc";
    import type { HouseKey } from "../housing/houses";

    export let house: HouseKey;
    export let included: boolean;
    export let current: number;
    export let target: number;

    $: materials = included ? calcMaterials(house, current, target) : {};
    $: error = included && target < current ? "Target must be >= current" : "";
</script>

<div class="row">
    <label class="include">
        <input type="checkbox" bind:checked={included} />
        <img src={`${import.meta.env.BASE_URL}house-icons/${house}.svg`} alt="{house} icon" class="icon" />
        <span>{house}</span>
    </label>

    <label>
        Current
        <input type="number" min="0" max="8" bind:value={current} disabled={!included} />
    </label>

    <label>
        Target
        <input type="number" min="0" max="8" bind:value={target} disabled={!included} />
    </label>
</div>

<style>
    .row {
        display: grid;
        gap: 0.75rem;
        grid-template-columns: 1.5fr 1fr 1fr;
        align-items: center;
        padding: 0.75rem;
        border-radius: 10px;
        background: rgba(0,0,0,.18);
    }

    .include {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
    }

    input[type="number"] {
        width: 80%;
    }

    .icon {
        width: 22px;
        height: 22px;
    }
</style>
