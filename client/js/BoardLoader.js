

class BoardLoader {

  static async loadBoard(name) {
    var resp = await fetch(`/api/${name}/board`, {
      method: 'get'
    })
    var json = await resp.json();
    return json;
  }

}

export { BoardLoader }
