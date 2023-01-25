<script lang="ts">
    import { transliterate, languages } from "$lib/utility/mappingUtility";

    let sourceLanguage = languages[0]
    let targetLanguage = languages[1]
    let text = ""
    $: transliterated = transliterate(text, sourceLanguage, targetLanguage)

    let buttonEnabled = true

    const copyToClipboard = () => {
        if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
            buttonEnabled = false
            setTimeout(() => {
                buttonEnabled = true
            }, 1000)
            return navigator.clipboard.writeText(transliterated);
        }
        alert("Your browser doesn't support clipboard api")
    };

    function capitalize(word: string) {
        return word.charAt(0).toUpperCase() + word.slice(1)
    }

    function flip() {
        [sourceLanguage as string, targetLanguage as string] = [targetLanguage, sourceLanguage]
        const pair = [transliterated, text]
        text = pair[0]
        transliterated = pair[1]
    }

</script>

<div class="layout">

    <select bind:value={sourceLanguage}>
        {#each languages.filter(language => language !== targetLanguage) as language}
            <option value={language}>{capitalize(language)} Script</option>
        {/each}
    </select>
    <textarea bind:value={text} placeholder="Type here..."></textarea>
    
    <button class="secondary outline" on:click={flip}>
        <span data-tooltip="Flip">&uarr;&darr;</span>
    </button>
    
    <select bind:value={targetLanguage} >
        {#each languages.filter(language => language !== sourceLanguage) as language}
            <option value={language}>{capitalize(language)} Script</option>
        {/each}
    </select>
    <textarea readonly placeholder="Transliteration will appear here...">{transliterated}</textarea>
    
    <button on:click={copyToClipboard} class:outline={!buttonEnabled}>
        {#if buttonEnabled}
            Copy to clipboard
        {:else}
            Copied!
        {/if}
    </button>
</div>

<style>
    textarea {
        resize: none;
        display: flex;
        flex-direction: row;
        height: 25vh;
    }
</style>