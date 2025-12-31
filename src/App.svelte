<script lang="ts">
  import { onMount } from "svelte";
  import { fetchMarketplacePrices } from "./lib/marketplace/fetch";
  
  import HouseRow from "./lib/components/HouseRow.svelte";
  import { calcMaterials, mergeCosts } from "./lib/housing/calc";
  import { HOUSES, type HouseKey } from "./lib/housing/houses";
  import { parseHouseRoomsFromImport } from "./lib/housing/import";

  let marketPrices: Record<string, { ask: number | null; bid: number | null }> = {};

  onMount(async () => {
    try {
      marketPrices = await fetchMarketplacePrices();
    } catch {
      console.log("Failed to load market prices");
    }
  });

  type MarketPrice = { ask: number | null; bid: number | null };

  function normalizeItemId(name: string): string {
    return name
            .toLowerCase()
            .trim()
            .replaceAll("'", "")
            .replace(/\s+/g, "_");
  }

  function getPrice(mat: string): MarketPrice | null {
    const key = normalizeItemId(mat);
    return marketPrices[key] ?? null;
  }

  $: totalAsk = Object.entries(grandTotal).reduce((sum, [mat, amt]) => {
    if (mat === "Coin") {
      return sum + amt;
    }
    const price = getPrice(mat);
    if (!price?.ask) return sum;
    return sum + price.ask * amt;
  }, 0);

  $: totalBid = Object.entries(grandTotal).reduce((sum, [mat, amt]) => {
    if (mat === "Coin") {
      return sum + amt;
    }
    const price = getPrice(mat);
    if (!price?.bid) return sum;
    return sum + price.bid * amt;
  }, 0);

  type Row = {
    house: HouseKey;
    included: boolean;
    current: number;
    target: number;
  };

  let rows: Row[] = HOUSES.map((house) => ({
    house,
    included: false,
    current: 0,
    target: 1,
  }));

  $: grandTotal = mergeCosts(
          rows
                  .filter((r) => r.included)
                  .map((r) => calcMaterials(r.house, r.current, r.target))
  );

  let importText = "";
  let importInfo = "";

  function applyImport() {
    importInfo = "";

    try {
      const imported = parseHouseRoomsFromImport(importText);

      const keys = Object.keys(imported);
      if (keys.length === 0) {
        importInfo = "Parsed JSON, but found 0 house rooms. (Likely mapping mismatch.)";
        return;
      }

      rows = rows.map((r) => {
        const lvl = imported[r.house];
        if (lvl == null) return r;

        return {
          ...r,
          included: true,
          current: lvl,
          target: Math.max(r.target, lvl),
        };
      });

      importInfo = `Imported ${keys.length} house room(s).`;
    } catch (e) {
      importInfo = "Could not parse import JSON. Make sure you pasted the full export text.";
    }
  }
</script>

<header>
  <h1>Milky Way Housing</h1>
  <p>Quickly calculate materials and cost for upgrading houses in Milky Way Idle</p>
</header>

<main class="content">
  <section class="panel">
    <div class="left">
      <div class="import">
        <label>
          Paste Milky Way Idle export JSON
          <textarea
                  bind:value={importText}
                  rows="6"
                  placeholder="Paste your Milky Way Idle export JSON here"
          ></textarea>
        </label>

        <button type="button" on:click={applyImport}>Import houses</button>

        {#if importInfo}
          <p class="muted">{importInfo}</p>
        {/if}
      </div>

      <div class="bulk">
        <button type="button" on:click={() => rows = rows.map(r => ({...r, included: true}))}>
          Include all
        </button>
        <button type="button" on:click={() => rows = rows.map(r => ({...r, included: false}))}>
          Include none
        </button>
      </div>

      <div class="rows">
        {#each rows as row (row.house)}
          <HouseRow
                  house={row.house}
                  bind:included={row.included}
                  bind:current={row.current}
                  bind:target={row.target}
          />
        {/each}
      </div>
    </div>

    <aside class="totals">
      {#if Object.keys(grandTotal).length !== 0}
        <header>
          <h3>Total Cost (A/B): {totalAsk.toLocaleString()} / {totalBid.toLocaleString()}</h3>
        </header>
        <div class="total-cost">

        </div>
        <table class="table">
          <thead>
          <tr>
            <th>Material</th>
            <th>Amount</th>
            <th>Cost (A/B)</th>
          </tr>
          </thead>
          <tbody>
          {#each Object.entries(grandTotal) as [mat, amt]}
            {@const price = getPrice(mat)}
            {@const icon = mat.toLowerCase().replaceAll(" ", "_") + ".svg"}
            <tr>
              <td>
                <img src={`${import.meta.env.BASE_URL}item-icons/${icon}`} alt="{mat} icon" class="icon" />
                {mat}
              </td>
              <td>{amt.toLocaleString()}</td>
              <td>
                {#if price}
                  {price.ask != null ? (price.ask * amt).toLocaleString() : "—"} /
                  {price.bid != null ? (price.bid * amt).toLocaleString() : "—"}
                {:else}
                  —
                {/if}
              </td>
            </tr>
          {/each}
          </tbody>
        </table>
      {:else}
        <p class="muted">Select houses to see totals</p>
      {/if}
    </aside>

  </section>
</main>

<style>
  header {
    color: white;
    text-align: center;
  }
  header h1 { margin: 0; }
  header p { opacity: 0.85; }

  .content {
    display: grid;
    place-items: start center;
    padding: 1rem;
  }

  .panel {
    width: min(1300px, 100%);
    padding: 1.25rem;
    border-radius: 12px;
    background: rgba(0,0,0,.25);

    display: grid;
    grid-template-columns: 1fr 660px; /* left | right */
    gap: 1.25rem;
  }

  .rows {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .totals {
    top: 1rem;
    align-self: start;

    padding: 1rem;
    border-radius: 10px;
    background: rgba(0,0,0,.35);
  }

  .table {
    width: 100%;
    border-collapse: collapse;
  }

  .table td, .table th {
    padding: 0.6rem;
    border-bottom: 1px solid rgba(255,255,255,.15);
    text-align: left;
  }

  .import { display: grid; gap: 0.75rem; margin-bottom: 1rem; }
  textarea {
    width: 96%;
    padding: 0.75rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,.2);
    background: rgba(0,0,0,.25);
    color: inherit;
    resize: vertical;
  }

  .icon {
    width: 22px;
    height: 22px;
    vertical-align: middle;
  }
</style>
