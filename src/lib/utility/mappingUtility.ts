import kannadaToOtherLangs from './kannadaToOtherLangs.json';
import genericMapping from './genericMapping.json';

interface Mapping {
    [character: string]: {
        [language: string]: string;
    }
}

export type Language = "kannada" | "telugu" | "devanagari" | "malayalam" | "generic";

const kannadaToGeneric = new Map<string, string>();
for (const character in genericMapping) {
    kannadaToGeneric.set((genericMapping as Mapping)[character]['kannada'], character);
}

const genericToKannada = new Map<string, string>();
for (const character in genericMapping) {
   genericToKannada.set(character, (genericMapping as Mapping)[character]['kannada']);
}

const validGenericCharacters = new Set<string>();
for (const character in genericMapping) {
    validGenericCharacters.add(character);
}


function getKannadaToLanguageMap(language: Language) {
    const kannadaToLanguage = new Map<string, string>();
    for (const character in kannadaToOtherLangs) {
        kannadaToLanguage.set(character, (kannadaToOtherLangs as Mapping)[character][language]);
    }

    const languageToKannada = new Map<string, string>();
    kannadaToLanguage.forEach((value, key) => {
        languageToKannada.set(value, key);
    });

    return {kannadaToLanguage, languageToKannada};
}

function transliterateToKannada(text: string, from: Language): string {
    const { languageToKannada} = getKannadaToLanguageMap(from);

    return text
        .split("")
        .map(char => languageToKannada.get(char) || char)
        .join("")
}

function transliterateFromKannada(text: string, to: Language): string {
    const { kannadaToLanguage} = getKannadaToLanguageMap(to);

    return text
        .split("")
        .map(char => kannadaToLanguage.get(char) || char)
        .join("")
}

function transliteratePurePhonetic(text: string, from: Language, to: Language): string {
    if (from === 'kannada')
        return transliterateFromKannada(text, to);

    if (to === 'kannada')
        return transliterateToKannada(text, from);

    const intermediateKannada = transliterateToKannada(text, from);
    return transliterateFromKannada(intermediateKannada, to);
}

function transliterateGenericToKannada(text: string): string {
    let result = "";
    const endChar = text
        .toLowerCase()
        .split("")
        .reduce((acc: string, char: string) => {
            if (genericToKannada.get(acc + char)) {
                result += genericToKannada.get(acc + char);
                return ""; 
            }

            if (genericToKannada.get(acc)) {
                result += genericToKannada.get(acc);
                if (char === "a") return "";
                return char;
            }

            result += acc;

            return char;
        }," ")
        .concat();

    return result + (genericToKannada.get(endChar) || endChar);
}

function transliterateKannadaToGeneric(text: string): string {
    let result = "";
    const endChar = (text + "")
        .split("")
        .reduce((acc: string, char: string) => {
            if (kannadaToGeneric.get(acc + char)) {
                result += kannadaToGeneric.get(acc + char);
                return ""; 
            }

            if (kannadaToGeneric.get(acc)) {
                result += kannadaToGeneric.get(acc);
                return char;
            }

            result += acc;

            return char;
        }, "")
        .concat()
        .toLowerCase();

    return result + (kannadaToGeneric.get(endChar) || endChar);
}

function transliterateGeneric(text: string, from: Language, to: Language): string {
    if (from === 'kannada') {
        if (to === 'generic')
            return transliterateKannadaToGeneric(text);
        return transliterateFromKannada(text, to);
    }

    if (to === 'kannada') {
        if (from === 'generic')
            return transliterateGenericToKannada(text);
        return transliterateToKannada(transliterateGenericToKannada(text), from);
    }

    if (from === 'generic') {
        const intermediateKannada = transliterateGenericToKannada(text);
        return transliterate(intermediateKannada, 'kannada', to);
    }

    return transliterate(transliterate(text, from, 'kannada'), 'kannada', to);
}

export function transliterate(text: string, from: Language, to: Language): string {
    const purePhoneticLangs = ['kannada', 'telugu', 'devanagari', 'malayalam'];

    if (purePhoneticLangs.includes(from) && purePhoneticLangs.includes(to)) 
        return transliteratePurePhonetic(text, from, to);

    return transliterateGeneric(text, from, to);
}

export const languages: Language[] = ['kannada', 'telugu', 'devanagari', 'malayalam', 'generic'];

export const genericCharacters = [...validGenericCharacters]