class MapFile {
    constructor (arrayBuffer) {
        this.byteLength         = arrayBuffer.byteLength
        this._off_00            = new       Uint8Array(arrayBuffer, 0x000000, 0x04)
        this._off_04            = new       Uint8Array(arrayBuffer, 0x000004, 0x10)
        this._off_14            = new       Uint8Array(arrayBuffer, 0x000014, 0x20)
        this._off_34            = new       Uint8Array(arrayBuffer, 0x000034, 0x20)
        this._width             = new       Uint8Array(arrayBuffer, 0x000054, 0x04)
        this._height            = new       Uint8Array(arrayBuffer, 0x000058, 0x04)
        this._depth             = new       Uint8Array(arrayBuffer, 0x00005C, 0x04)
        this._specialLength     = new       Uint8Array(arrayBuffer, 0x000060, 0x04)
        this._off_64            = new       Uint8Array(arrayBuffer, 0x000064, 0x04)
        this.tiles              = new    MapFile.Tiles(arrayBuffer, 0x000068, this.width, this.height, this.depth)
        this.specials           = new MapFile.Specials(arrayBuffer, 0x000068 + this.tiles.byteLength, this.specialLength)
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
    get depth () {
        return this._depth.reduce((t, v, i)=>{return t+v*256**i})
    }
    set depth (v) {
        this._depth = Uint8Array.of((v&0xFF), (v&0xFF00)>>8, (v&0xFF0000)>>16, (v&0xFF000000)>>24)
    }
    get specialLength () {
        return this._specialLength.reduce((t, v, i)=>{return t+v*256**i})
    }
    set specialLength (v) {
        this._specialLength = Uint8Array.of((v&0xFF), (v&0xFF00)>>8, (v&0xFF0000)>>16, (v&0xFF000000)>>24)
    }
}

MapFile.Tiles = class {
    constructor (arrayBuffer, start, width, height, depth) {
        arrayBuffer = arrayBuffer.slice(start, start+MapFile.Tile.byteLength * width * height * depth)
        this._raw = arrayBuffer
        this.byteLength = MapFile.Tile.byteLength * width * height * depth
        this.width = width
        this.height = height
        this.depth = depth
        this.tiles = new Array(width * height * depth)
        for (let i=0; i<this.tiles.length; i++) {
            this.tiles[i] = new MapFile.Tile(arrayBuffer.slice(i*MapFile.Tile.byteLength, (i+1)*MapFile.Tile.byteLength))
        }
    }
    getTile(x, y, z) {
        if (x < 0 || y < 0 || z < 0 || x > this.width || y > this.height || z > this.depth) return null
        return this.tiles[x+y*this.width+z*this.height*this.width]
    }
    setTile(x, y, z, tile) {
        if (x < 0 || y < 0 || z < 0 || x > this.width || y > this.height || z > this.depth) return null
        this.tiles[x+y*this.width+z*this.height*this.width] = tile
        return tile
    }
    get raw () {
        return new Uint8Array(this._raw)
    }
}

MapFile.Tile = class {
    constructor (arrayBuffer) {
        this._raw               = arrayBuffer
        this._off_00            = new   Uint8Array(arrayBuffer, 0x00, 0x04)
        this._objectId          = new   Uint8Array(arrayBuffer, 0x04, 0x04)
        this._sheetId           = new   Uint8Array(arrayBuffer, 0x08, 0x04)
        this._spriteIndex       = new   Uint8Array(arrayBuffer, 0x0C, 0x04)
        this._variant           = new   Uint8Array(arrayBuffer, 0x10, 0x04)
        this._off_14            = new   Uint8Array(arrayBuffer, 0x14, 0x04)
        this._off_18            = new   Uint8Array(arrayBuffer, 0x18, 0x04)
    }
    get objectId () {
        return this._objectId.reduce((t, v, i)=>{return t+v*256**i})
    }
    set objectId (v) {
        this._objectId = Uint8Array.of((v&0xFF), (v&0xFF00)>>8, (v&0xFF0000)>>16, (v&0xFF000000)>>24)
    }
    get sheetId () {
        return this._sheetId.reduce((t, v, i)=>{return t+v*256**i})
    }
    set sheetId (v) {
        this._sheetId = Uint8Array.of((v&0xFF), (v&0xFF00)>>8, (v&0xFF0000)>>16, (v&0xFF000000)>>24)
    }
    get spriteIndex () {
        return this._spriteIndex.reduce((t, v, i)=>{return t+v*256**i})
    }
    set spriteIndex (v) {
        this._spriteIndex = Uint8Array.of((v&0xFF), (v&0xFF00)>>8, (v&0xFF0000)>>16, (v&0xFF000000)>>24)
    }
    get variant () {
        return this._variant.reduce((t, v, i)=>{return t+v*256**i})
    }
    set variant (v) {
        this._variant = Uint8Array.of((v&0xFF), (v&0xFF00)>>8, (v&0xFF0000)>>16, (v&0xFF000000)>>24)
    }
    static byteLength = 0x1C
    get raw () {
        return new Uint8Array(this._raw)
    }
}

MapFile.Specials = class {
    constructor (arrayBuffer, start, length) {
        arrayBuffer = arrayBuffer.slice(start)
        this._raw = arrayBuffer
        this.byteLength = 0
        this.specials = new Array(length)
        for (let i=0; i<this.specials.length; i++) {
            this.specials[i] = new MapFile.Special(arrayBuffer.slice(this.byteLength))
            this.byteLength += this.specials[i].byteLength
        }
    }
    get raw () {
        return new Uint8Array(this._raw)
    }
}

MapFile.Special = class {
    constructor (arrayBuffer) {
        this._id                = new   Uint8Array(arrayBuffer, 0x00, 0x04)
        this._posX              = new   Uint8Array(arrayBuffer, 0x04, 0x04)
        this._posY              = new   Uint8Array(arrayBuffer, 0x08, 0x04)
        this._off_0c            = new   Uint8Array(arrayBuffer, 0x0C, 0x04)
        this._objectId          = new   Uint8Array(arrayBuffer, 0x10, 0x04)
        this._sheetId           = new   Uint8Array(arrayBuffer, 0x14, 0x04)
        this._spriteIndex       = new   Uint8Array(arrayBuffer, 0x18, 0x04)
        this._extra1Length      = new   Uint8Array(arrayBuffer, 0x1C, 0x04)
        this._extra2Length      = new   Uint8Array(arrayBuffer, 0x20, 0x04)
        this._extra3Length      = new   Uint8Array(arrayBuffer, 0x24, 0x04)
        this._extra4Length      = new   Uint8Array(arrayBuffer, 0x28, 0x04)
        this._variant           = new   Uint8Array(arrayBuffer, 0x2C, 0x04)
        this._zOrder            = new   Uint8Array(arrayBuffer, 0x30, 0x04)
        this._off_34            = new   Uint8Array(arrayBuffer, 0x34, 0x04)
        this._off_38            = new   Uint8Array(arrayBuffer, 0x38, 0x04)
        this.extra1             = new   Uint8Array(arrayBuffer, 0x3C, 0x04 * this.extra1Length)
        this.extra2             = new   Uint8Array(arrayBuffer, 0x3C + 0x04 * this.extra1Length, 0x0C * this.extra2Length)
        this.extra3             = new   Uint8Array(arrayBuffer, 0x3C + 0x04 * this.extra1Length + 0x0C * this.extra2Length, 0x100 * this.extra3Length)
        this.extra4             = new   Uint8Array(arrayBuffer, 0x3C + 0x04 * this.extra1Length + 0x0C * this.extra2Length + 0x100 * this.extra3Length, 0x08 * this.extra4Length)
        this.byteLength         = 0x3C + 0x04 * this.extra1Length + 0x0C * this.extra2Length + 0x100 * this.extra3Length + 0x08 * this.extra4Length
        this._raw               = arrayBuffer.slice(0x00, this.byteLength)
    }
    get id () {
        return this._id.reduce((t, v, i)=>{return t+v*256**i})
    }
    set id (v) {
        this._id = Uint8Array.of((v&0xFF), (v&0xFF00)>>8, (v&0xFF0000)>>16, (v&0xFF000000)>>24)
    }
    get posX () {
        return this._posX.reduce((t, v, i)=>{return t+v*256**i})
    }
    set posX (v) {
        this._posX = Uint8Array.of((v&0xFF), (v&0xFF00)>>8, (v&0xFF0000)>>16, (v&0xFF000000)>>24)
    }
    get posY () {
        return this._posY.reduce((t, v, i)=>{return t+v*256**i})
    }
    set posY (v) {
        this._posY = Uint8Array.of((v&0xFF), (v&0xFF00)>>8, (v&0xFF0000)>>16, (v&0xFF000000)>>24)
    }
    get objectId () {
        return this._objectId.reduce((t, v, i)=>{return t+v*256**i})
    }
    set objectId (v) {
        this._objectId = Uint8Array.of((v&0xFF), (v&0xFF00)>>8, (v&0xFF0000)>>16, (v&0xFF000000)>>24)
    }
    get sheetId () {
        return this._sheetId.reduce((t, v, i)=>{return t+v*256**i})
    }
    set sheetId (v) {
        this._sheetId = Uint8Array.of((v&0xFF), (v&0xFF00)>>8, (v&0xFF0000)>>16, (v&0xFF000000)>>24)
    }
    get spriteIndex () {
        return this._spriteIndex.reduce((t, v, i)=>{return t+v*256**i})
    }
    set spriteIndex (v) {
        this._spriteIndex = Uint8Array.of((v&0xFF), (v&0xFF00)>>8, (v&0xFF0000)>>16, (v&0xFF000000)>>24)
    }
    get variant () {
        return this._variant.reduce((t, v, i)=>{return t+v*256**i})
    }
    set variant (v) {
        this._variant = Uint8Array.of((v&0xFF), (v&0xFF00)>>8, (v&0xFF0000)>>16, (v&0xFF000000)>>24)
    }
    get zOrder () {
        return this._zOrder.reduce((t, v, i)=>{return t+v*256**i})
    }
    set zOrder (v) {
        this._zOrder = Uint8Array.of((v&0xFF), (v&0xFF00)>>8, (v&0xFF0000)>>16, (v&0xFF000000)>>24)
    }
    get extra1Length () {
        return this._extra1Length.reduce((t, v, i)=>{return t+v*256**i})
    }
    get extra2Length () {
        return this._extra2Length.reduce((t, v, i)=>{return t+v*256**i})
    }
    get extra3Length () {
        return this._extra3Length.reduce((t, v, i)=>{return t+v*256**i})
    }
    get extra4Length () {
        return this._extra4Length.reduce((t, v, i)=>{return t+v*256**i})
    }
    get raw () {
        return new Uint8Array(this._raw)
    }
}

MapFile.displayData = (element, dataAsArrayBuffer, backgroundImage=null, mapParallaxFront=null, mapParallaxBack=null) => {
    const map = new MapFile(dataAsArrayBuffer)
    MapFile.displayDataFromMap(element, map, backgroundImage, mapParallaxFront, mapParallaxBack)
    return map
}
MapFile.displayDataFromMap = (element, map, backgroundImage=null, mapParallaxFront=null, mapParallaxBack=null) => {
    element.innerHTML = ''
    if (backgroundImage) {
        const background = document.createElement('div')
        background.classList.add('background')
        background.style.backgroundImage = 'url(images/'+backgroundImage+'.png)'
        element.appendChild(background)
    }
    if (mapParallaxFront) {
        const parallaxFront = document.createElement('div')
        parallaxFront.classList.add('parallax')
        parallaxFront.classList.add('front')
        // parallaxFront.style.backgroundPositionY = map.mapParallaxFront.offsetY + 'px'
        parallaxFront.style.backgroundImage = 'url(images/'+mapParallaxFront.image+'.png)'
        element.appendChild(parallaxFront)
    }
    if (mapParallaxBack) {
        const parallaxBack = document.createElement('div')
        parallaxBack.classList.add('parallax')
        parallaxBack.classList.add('back')
        // parallaxBack.style.backgroundPositionY = map.mapParallaxBack.offsetY + 'px'
        parallaxBack.style.backgroundImage = 'url(images/'+mapParallaxBack.image+'.png)'
        element.appendChild(parallaxBack)
    }
    const layer = document.createElement('div')
    layer.classList.add('layer')
    for (let z=0;z<3;z++) {
        for (let y=0;y<map.height;y++) {
            for (let x=0;x<map.width;x++) {
                const t = map.tiles.getTile(x, y, z)
                if (t.objectId && Sotes.Objects[t.objectId]?.resources) {
                    const d = document.createElement('div')
                    let SSR = Sotes.Objects[t.objectId].resources.SSR
                    if (SSR.length) {
                        switch (t.objectId) {
                            case 112015:
                            case 171010:
                            case 171020:
                            case 171030:
                            case 172020:
                            case 172030:
                            case 172040:
                                if (t.variant >= 10 && t.variant <= 15) {
                                    const b = document.createElement('div')
                                    b.style.backgroundImage = 'url(images/'+SSR[1]+'.png)'
                                    const sb = Sotes.SpriteSheets[SSR[1]]
                                    let offsetTileX = 0, offsetTileY = 0, sprite = t.variant - 10;
                                    if (sb) {
                                        while (sprite >= sb.rows) {
                                            offsetTileY += 1
                                            sprite -= sb.rows
                                        }
                                        offsetTileX = sprite * sb.sizeX * -1
                                        offsetTileY *= sb.sizeY * -1
                                        b.style.width = sb.sizeX + 'px'
                                        b.style.height = sb.sizeY + 'px'
                                    }
                                    b.style.backgroundPositionX = offsetTileX + 'px'
                                    b.style.backgroundPositionY = offsetTileY + 'px'
                                    b.style.left = x * 32 + (t.variant == 13 ? 128 : 0) + 'px'
                                    b.style.top = y * 32 + (t.variant == 13 ? 64 : (t.variant == 14 ? 32 : 0)) + 'px'
                                    b.style.zIndex = z
                                    layer.appendChild(b)
                                }
                                SSR = SSR[0]
                                break
                            default:
                                SSR = SSR[0]
                        }
                    }
                    d.style.backgroundImage = 'url(images/'+SSR+'.png)'
                    const s = Sotes.SpriteSheets[SSR]
                    let offsetTileX = 0, offsetTileY = 0, sprite = t.spriteIndex;
                    if (s) {
                        while (sprite >= s.rows) {
                            offsetTileY += 1
                            sprite -= s.rows
                        }
                        offsetTileX = sprite * s.sizeX * -1
                        offsetTileY *= s.sizeY * -1
                        d.style.width = s.sizeX + 'px'
                        d.style.height = s.sizeY + 'px'
                    }
                    d.style.backgroundPositionX = offsetTileX + 'px'
                    d.style.backgroundPositionY = offsetTileY + 'px'
                    d.style.left = x * 32 + 'px'
                    d.style.top = y * 32 + 'px'
                    d.style.zIndex = z
                    layer.appendChild(d)
                }
            }
        }
    }
    for (let i=0;i<map.specials.specials.length;i++) {
        const t = map.specials.specials[i]
        if (t.objectId && Sotes.Objects[t.objectId]?.resources) {
            const d = document.createElement('div')
            const SSI = Sotes.Objects[t.objectId].resources.SSI.length ? Sotes.Objects[t.objectId].resources.SSI[t.variant] : Sotes.Objects[t.objectId].resources.SSI
            const SSR = Sotes.SpriteSheetsIds[SSI]
            d.style.backgroundImage = 'url(images/'+SSR+'.png)'
            const s = Sotes.SpriteSheets[SSR]
            let offsetTileX = 0, offsetTileY = 0, sprite = t.spriteIndex;
            if (s) {
                while (sprite >= s.rows) {
                    offsetTileY += 1
                    sprite -= s.rows
                }
                offsetTileX = sprite * s.sizeX * -1
                offsetTileY *= s.sizeY * -1
                d.style.width = s.sizeX + 'px'
                d.style.height = s.sizeY + 'px'
            } else {
                console.log(t.sheetId)
            }
            d.style.backgroundPositionX = offsetTileX + 'px'
            d.style.backgroundPositionY = offsetTileY + 'px'
            d.style.left = t.posX + 'px'
            d.style.top = t.posY + 'px'
            d.style.zIndex = t.zOrder
            if (50000 <= t.objectId < 60000 && t.zOrder == 0) d.style.zIndex = 13
            else if (50000 <= t.objectId < 60000) d.style.zIndex = 7
            else if (60000 <= t.objectId < 70000 && t.zOrder == 0) d.style.zIndex = 8
            else if (60000 <= t.objectId < 70000) d.style.zIndex = 15
            else if (70000 <= t.objectId < 80000) d.style.zIndex = 9
            layer.appendChild(d)
        } else console.log(t)
    }
    element.appendChild(layer)
}