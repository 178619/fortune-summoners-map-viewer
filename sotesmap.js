class MapMemory {
    constructor (arrayBuffer) {
        this.byteLength         = arrayBuffer.byteLength
        this._backgroundImage   = new             Uint8Array(arrayBuffer, 0x000000, 0x02)
        this._off_02            = new             Uint8Array(arrayBuffer, 0x000002, 0x02)
        this.mapParallaxFront   = new  MapMemory.MapParallax(arrayBuffer, 0x000004, 0x06)
        this._off_0a            = new             Uint8Array(arrayBuffer, 0x00000A, 0x02)
        this._off_0c            = new             Uint8Array(arrayBuffer, 0x00000C, 0x04)
        this.mapParallaxBack    = new  MapMemory.MapParallax(arrayBuffer, 0x000010, 0x06)
        this._off_16            = new             Uint8Array(arrayBuffer, 0x000016, 0x02)
        this._off_18            = new             Uint8Array(arrayBuffer, 0x000018, 0x04)
        this._off_1c            = new             Uint8Array(arrayBuffer, 0x00001C, 0x04)
        this._off_20            = new             Uint8Array(arrayBuffer, 0x000020, 0x04)
        this._off_24            = new             Uint8Array(arrayBuffer, 0x000024, 0x02)
        this._off_26            = new             Uint8Array(arrayBuffer, 0x000026, 0x02)
        this._off_28            = new             Uint8Array(arrayBuffer, 0x000028, 0x04)
        this._off_2c            = new             Uint8Array(arrayBuffer, 0x00002C, 0x02)
        this._off_2e            = new             Uint8Array(arrayBuffer, 0x00002E, 0x02)
        this.tileGraphics       = new MapMemory.TileGraphics(arrayBuffer, 0x000030, 0x140000)
        this.tilePhysics        = new  MapMemory.TilePhysics(arrayBuffer, 0x140030, 0x050000)
        this._off_190030        =                     arrayBuffer.slice(  0x190030, 0x005000 + 0x190030)
        this._off_195030        =                     arrayBuffer.slice(  0x195030, 0x03C000 + 0x195030)
        this._off_1d1030        =                     arrayBuffer.slice(  0x1D1030, 0x0F0000 + 0x1D1030)
        this._width             = new             Uint8Array(arrayBuffer, 0x2C1030, 0x04)
        this._height            = new             Uint8Array(arrayBuffer, 0x2C1034, 0x04)
        this._widthPixel        = new             Uint8Array(arrayBuffer, 0x2C1038, 0x04)
        this._heightPixel       = new             Uint8Array(arrayBuffer, 0x2C103C, 0x04)
        this._off_2c1040        =                     arrayBuffer.slice(  0x2C1040, 0x00A000 + 0x2C1040)
        this._off_2cb040        = new             Uint8Array(arrayBuffer, 0x2CB040, 0x04)
    }
    get backgroundImage () {
        return this._backgroundImage.reduce((t, v, i)=>{return t+v*256**i})
    }
    set backgroundImage (v) {
        this._backgroundImage = Uint8Array.of((v&0xFF), (v&0xFF00)>>8)
    }
    get width () {
        return this._width.reduce((t, v, i)=>{return t+v*256**i})
    }
    set width (v) {
        this._width = Uint8Array.of((v&0xFF), (v&0xFF00)>>8, (v&0xFF0000)>>16, (v&0xFF000000)>>24)
    }
    get height () {
        return this._height.reduce((t, v, i)=>{return t+v*256**i})
    }
    set height (v) {
        this._height = Uint8Array.of((v&0xFF), (v&0xFF00)>>8, (v&0xFF0000)>>16, (v&0xFF000000)>>24)
    }
    get widthPixel () {
        return this._widthPixel.reduce((t, v, i)=>{return t+v*256**i})
    }
    set widthPixel (v) {
        this._widthPixel = Uint8Array.of((v&0xFF), (v&0xFF00)>>8, (v&0xFF0000)>>16, (v&0xFF000000)>>24)
    }
    get heightPixel () {
        return this._heightPixel.reduce((t, v, i)=>{return t+v*256**i})
    }
    set heightPixel (v) {
        this._heightPixel = Uint8Array.of((v&0xFF), (v&0xFF00)>>8, (v&0xFF0000)>>16, (v&0xFF000000)>>24)
    }
}
MapMemory.MapParallax = class {
    constructor (arrayBuffer, start, length) {
        arrayBuffer = arrayBuffer.slice(start, start+length)
        this._image             = new   Uint8Array(arrayBuffer, 0x00, 0x02)
        this._offsetY           = new   Uint8Array(arrayBuffer, 0x02, 0x02)
        this._off_04            = new   Uint8Array(arrayBuffer, 0x04, 0x02)
    }
    static byteLength = 6
    get image () {
        return this._image.reduce((t, v, i)=>{return t+v*256**i})
    }
    set image (v) {
        this._image = Uint8Array.of((v&0xFF), (v&0xFF00)>>8)
    }
    get offsetY () {
        return this._offsetY.reduce((t, v, i)=>{return t+v*256**i})
    }
    set offsetY (v) {
        this._offsetY = Uint8Array.of((v&0xFF), (v&0xFF00)>>8)
    }
    get raw () {
        return new Uint8Array(this._raw)
    }
    set raw (v) {
        const arrayBuffer       = v.buffer
        this._raw               = arrayBuffer
        this._image             = new   Uint8Array(arrayBuffer, 0x00, 0x02)
        this._offsetY           = new   Uint8Array(arrayBuffer, 0x02, 0x02)
        this._off_04            = new   Uint8Array(arrayBuffer, 0x04, 0x02)
    }
}
MapMemory.TileGraphics = class {
    constructor (arrayBuffer, start, length) {
        arrayBuffer = arrayBuffer.slice(start, start+length)
        this._raw = arrayBuffer
        this.tiles = new Array(parseInt(arrayBuffer.byteLength / MapMemory.TileGraphic.byteLength))
        for (let i=0; i<this.tiles.length; i++) {
            this.tiles[i] = new MapMemory.TileGraphic(arrayBuffer.slice(i*MapMemory.TileGraphic.byteLength, (i+1)*MapMemory.TileGraphic.byteLength))
        }
    }
    getTile(x, y, z) {
        if (x < 0 || y < 0 || z < 0 || x > 160 || y > 128 || z > 4) return null
        return this.tiles[z+y*4+x*4*128]
    }
    setTile(x, y, z, tile) {
        if (x < 0 || y < 0 || z < 0 || x > 160 || y > 128 || z > 4) return null
        this.tiles[z+y*4+x*4*128] = tile
        return tile
    }
    get raw () {
        return new Uint8Array(this._raw)
    }
}
MapMemory.TileGraphic = class {
    constructor (arrayBuffer) {
        this._raw               = arrayBuffer
        this._spriteSheet       = new   Uint8Array(arrayBuffer, 0x00, 0x02)
        this._sprite            = new   Uint8Array(arrayBuffer, 0x02, 0x02)
        this._zOrder            = new   Uint8Array(arrayBuffer, 0x04, 0x02)
        this._off_06            = new   Uint8Array(arrayBuffer, 0x04, 0x02)
        this._offsetX           = new   Uint8Array(arrayBuffer, 0x08, 0x04)
        this._offsetY           = new   Uint8Array(arrayBuffer, 0x0C, 0x04)
    }
    static byteLength = 0x10
    get spriteSheet () {
        return this._spriteSheet.reduce((t, v, i)=>{return t+v*256**i})
    }
    set spriteSheet (v) {
        this._spriteSheet = Uint8Array.of((v&0xFF), (v&0xFF00)>>8)
    }
    get sprite () {
        return this._sprite.reduce((t, v, i)=>{return t+v*256**i})
    }
    set sprite (v) {
        this._sprite = Uint8Array.of((v&0xFF), (v&0xFF00)>>8)
    }
    get zOrder () {
        return this._zOrder.reduce((t, v, i)=>{return t+v*256**i})
    }
    set zOrder (v) {
        this._zOrder = Uint8Array.of((v&0xFF), (v&0xFF00)>>8)
    }
    get offsetX () {
        return this._offsetX.reduce((t, v, i)=>{return t+v*256**i})
    }
    set offsetX (v) {
        this._offsetX = Uint8Array.of((v&0xFF), (v&0xFF00)>>8)
    }
    get offsetY () {
        return this._offsetY.reduce((t, v, i)=>{return t+v*256**i})
    }
    set offsetY (v) {
        this._offsetY = Uint8Array.of((v&0xFF), (v&0xFF00)>>8)
    }
    get raw () {
        return new Uint8Array(this._raw)
    }
    set raw (v) {
        const arrayBuffer       = v.buffer
        this._raw               = arrayBuffer
        this._spriteSheet       = new   Uint8Array(arrayBuffer, 0x00, 0x02)
        this._sprite            = new   Uint8Array(arrayBuffer, 0x02, 0x02)
        this._zOrder            = new   Uint8Array(arrayBuffer, 0x04, 0x02)
        this._off_06            = new   Uint8Array(arrayBuffer, 0x04, 0x02)
        this._offsetX           = new   Uint8Array(arrayBuffer, 0x08, 0x04)
        this._offsetY           = new   Uint8Array(arrayBuffer, 0x0C, 0x04)
    }
}
MapMemory.TilePhysics = class {
    constructor (arrayBuffer, start, length) {
        arrayBuffer = arrayBuffer.slice(start, start+length)
        this._raw = arrayBuffer
        this.tiles = new Array(parseInt(arrayBuffer.byteLength / MapMemory.TilePhysic.byteLength))
        for (let i=0; i<this.tiles.length; i++) {
            this.tiles[i] = new MapMemory.TilePhysic(arrayBuffer.slice(i*MapMemory.TilePhysic.byteLength, (i+1)*MapMemory.TilePhysic.byteLength))
        }
    }
    getTile(x, y) {
        return this.tiles[y*160+x]
    }
    setTile(x, y, tile) {
        this.tiles[y*160+x] = tile
        return tile
    }
    get raw () {
        return new Uint8Array(this._raw)
    }
}
MapMemory.TilePhysic = class {
    constructor (arrayBuffer) {
        this._raw               = arrayBuffer
        this._off_00            = new   Uint8Array(arrayBuffer, 0x00, 0x02)
        this._off_02            = new   Uint8Array(arrayBuffer, 0x02, 0x02)
        this._TileMaterial      = new   Uint8Array(arrayBuffer, 0x04, 0x04)
        this.FloorMap           = new   Uint8Array(arrayBuffer, 0x08, 0x04)
        this._off_0c            = new   Uint8Array(arrayBuffer, 0x0C, 0x04)
    }
    static byteLength = 0x10
    get TileMaterial () {
        const t = this._TileMaterial.reduce((t, v, i)=>{return t+v*256**i})
        if (Object.values(TileMaterial).includes(t)) return Object.entries(TileMaterial).find(([k, v])=>{return t == v})[0]
        return t
    }
    set TileMaterial (t) {
        let v
        if (typeof t == "number") v = t; else if (Object.keys(TileMaterial).includes(t)) v = TileMaterial[t]; else return false;
        this._TileMaterial = Uint8Array.of((v&0xFF), (v&0xFF00)>>8, (v&0xFF0000)>>16, (v&0xFF000000)>>24)
    }
    get raw () {
        return new Uint8Array(this._raw)
    }
    set raw (v) {
        const arrayBuffer       = v.buffer
        this._raw               = arrayBuffer
        this._off_00            = new   Uint8Array(arrayBuffer, 0x00, 0x02)
        this._off_02            = new   Uint8Array(arrayBuffer, 0x02, 0x02)
        this._TileMaterial      = new   Uint8Array(arrayBuffer, 0x04, 0x04)
        this.FloorMap           = new   Uint8Array(arrayBuffer, 0x08, 0x04)
        this._off_0c            = new   Uint8Array(arrayBuffer, 0x0C, 0x04)
    }
}
MapMemory.displayData = (element, dataAsArrayBuffer) => {
    const map = new MapMemory(dataAsArrayBuffer)
    MapMemory.displayDataFromMap(element, map)
    return map
}
MapMemory.displayDataFromMap = (element, map) => {
    element.innerHTML = ''
    if (map.backgroundImage) {
        const background = document.createElement('div')
        background.classList.add('background')
        background.style.backgroundImage = 'url(images/'+Sotes.SpriteSheetsIds[map.backgroundImage]+'.png)'
        element.appendChild(background)
    }
    if (map.mapParallaxFront.image) {
        const parallaxFront = document.createElement('div')
        parallaxFront.classList.add('parallax')
        parallaxFront.classList.add('front')
        // parallaxFront.style.backgroundPositionY = map.mapParallaxFront.offsetY + 'px'
        parallaxFront.style.backgroundImage = 'url(images/'+Sotes.SpriteSheetsIds[map.mapParallaxFront.image]+'.png)'
        element.appendChild(parallaxFront)
    }
    if (map.mapParallaxBack.image) {
        const parallaxBack = document.createElement('div')
        parallaxBack.classList.add('parallax')
        parallaxBack.classList.add('back')
        // parallaxBack.style.backgroundPositionY = map.mapParallaxBack.offsetY + 'px'
        parallaxBack.style.backgroundImage = 'url(images/'+Sotes.SpriteSheetsIds[map.mapParallaxBack.image]+'.png)'
        element.appendChild(parallaxBack)
    }
    const layer = document.createElement('div')
    layer.classList.add('layer')
    for (let z=0;z<4;z++) {
        for (let y=0;y<map.height;y++) {
            for (let x=0;x<map.width;x++) {
                const t = map.tileGraphics.getTile(x, y, z)
                if (t.spriteSheet) {
                    const d = document.createElement('div')
                    d.style.backgroundImage = 'url(images/'+Sotes.SpriteSheetsIds[t.spriteSheet]+'.png)'
                    const s = Sotes.SpriteSheets[Sotes.SpriteSheetsIds[t.spriteSheet]]
                    let offsetTileX = 0, offsetTileY = 0, sprite = t.sprite;
                    if (s) {
                        while (sprite >= s.rows) {
                            offsetTileY += 1
                            sprite -= s.rows
                        }
                        offsetTileX = sprite * s.sizeX * -1
                        offsetTileY *= s.sizeY * -1
                    }
                    d.style.backgroundPositionX = offsetTileX + t.offsetX * -32 + 'px'
                    d.style.backgroundPositionY = offsetTileY + t.offsetY * -32 + 'px'
                    d.style.left = x * 32 + 'px'
                    d.style.top = y * 32 + 'px'
                    d.style.zIndex = z
                    layer.appendChild(d)
                }
            }
        }
    }
    element.appendChild(layer)
}