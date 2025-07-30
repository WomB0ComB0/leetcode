class Trie {
  map: Map<string, Trie>;
  end: string | boolean;

  constructor() {
    this.map = new Map();
    this.end = false;
  }
}

function replaceWords(dictionary: string[], sentence: string): string {
  const trie = new Trie();
  for (const root of dictionary) {
    let it = trie;
    for (const char of root) {
      if (!it.map.has(char)) it.map.set(char, new Trie());
      it = it.map.get(char)!;
    }
    it.end = root;
  }

  const words = sentence.split(' ');
  const res: string[] = [];
  for (const word of words) {
    res.push(word);
    let it = trie;
    for (const char of word) {
      if (!it.map.has(char)) break;
      it = it.map.get(char)!;
      if (it.end !== false) {
        res.pop();
        res.push(it.end as string);
        break;
      }
    }
  }
  return res.join(' ');
}
