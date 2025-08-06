class MarvelService {
  _apiBase = "https://marvel-server-zeta.vercel.app";
  _apiKey = "apikey=d4eecb0c66dedbfae4eab45d312fc1df";

  getResource = async (url) => {
    let res = await fetch(url);

    // res.ok true OR false,
    // res.status 200, 404, 403, 500

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status ${res.status}`);
    }

    return await res.json();
  };

  getAllCharacters = async (offset = 0) => {
    const res = await this.getResource(
      `${this._apiBase}/characters?limit=9&offset=${offset}&${this._apiKey}`
    );
    return res.data.results.map(this._transformCharacter);
  };

  getCharacter = async (id) => {
    const res = await this.getResource(
      `${this._apiBase}/characters/${id}?${this._apiKey}`
    );
    return this._transformCharacter(res.data.results[0]);
  };
  _transformCharacter = (char) => {
    const description = char.description
      ? char.description.length > 20
        ? `${char.description.slice(0, 20)}...`
        : char.description
      : "There is no description for this character";

    return {
      id: char.id,
      name: char.name,
      description: description,
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  };
}

export default MarvelService;
