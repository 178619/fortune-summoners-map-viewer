class Map {
    constructor (arrayBuffer) {
        this.byteLength         = arrayBuffer.byteLength
        this._backgroundImage   = new       Uint8Array(arrayBuffer, 0x000000, 0x02)
        this._off_02            = new       Uint8Array(arrayBuffer, 0x000002, 0x02)
        this.mapParallaxFront   = new  Map.MapParallax(arrayBuffer, 0x000004, 0x06)
        this._off_0a            = new       Uint8Array(arrayBuffer, 0x00000A, 0x02)
        this._off_0c            = new       Uint8Array(arrayBuffer, 0x00000C, 0x04)
        this.mapParallaxBack    = new  Map.MapParallax(arrayBuffer, 0x000010, 0x06)
        this._off_16            = new       Uint8Array(arrayBuffer, 0x000016, 0x02)
        this._off_18            = new       Uint8Array(arrayBuffer, 0x000018, 0x04)
        this._off_1c            = new       Uint8Array(arrayBuffer, 0x00001C, 0x04)
        this._off_20            = new       Uint8Array(arrayBuffer, 0x000020, 0x04)
        this._off_24            = new       Uint8Array(arrayBuffer, 0x000024, 0x02)
        this._off_26            = new       Uint8Array(arrayBuffer, 0x000026, 0x02)
        this._off_28            = new       Uint8Array(arrayBuffer, 0x000028, 0x04)
        this._off_2c            = new       Uint8Array(arrayBuffer, 0x00002C, 0x02)
        this._off_2e            = new       Uint8Array(arrayBuffer, 0x00002E, 0x02)
        this.tileGraphics       = new Map.TileGraphics(arrayBuffer, 0x000030, 0x140000)
        this.tilePhysics        = new  Map.TilePhysics(arrayBuffer, 0x140030, 0x050000)
        this._off_190030        =               arrayBuffer.slice(  0x190030, 0x005000 + 0x190030)
        this._off_195030        =               arrayBuffer.slice(  0x195030, 0x03C000 + 0x195030)
        this._off_1d1030        =               arrayBuffer.slice(  0x1D1030, 0x0F0000 + 0x1D1030)
        this._width             = new       Uint8Array(arrayBuffer, 0x2C1030, 0x04)
        this._height            = new       Uint8Array(arrayBuffer, 0x2C1034, 0x04)
        this._widthPixel        = new       Uint8Array(arrayBuffer, 0x2C1038, 0x04)
        this._heightPixel       = new       Uint8Array(arrayBuffer, 0x2C103C, 0x04)
        this._off_2c1040        =               arrayBuffer.slice(  0x2C1040, 0x00A000 + 0x2C1040)
        this._off_2cb040        = new       Uint8Array(arrayBuffer, 0x2CB040, 0x04)
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
Map.MapParallax = class {
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
Map.TileGraphics = class {
    constructor (arrayBuffer, start, length) {
        arrayBuffer = arrayBuffer.slice(start, start+length)
        this._raw = arrayBuffer
        this.tiles = new Array(parseInt(arrayBuffer.byteLength / Map.TileGraphic.byteLength))
        for (let i=0; i<this.tiles.length; i++) {
            this.tiles[i] = new Map.TileGraphic(arrayBuffer.slice(i*Map.TileGraphic.byteLength, (i+1)*Map.TileGraphic.byteLength))
        }
    }
    getTile(x, y, z) {
        return this.tiles[z+y*4+x*4*128]
    }
    setTile(x, y, z, tile) {
        this.tiles[z+y*4+x*4*128] = tile
        return tile
    }
    get raw () {
        return new Uint8Array(this._raw)
    }
}
Map.TileGraphic = class {
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
Map.TilePhysics = class {
    constructor (arrayBuffer, start, length) {
        arrayBuffer = arrayBuffer.slice(start, start+length)
        this._raw = arrayBuffer
        this.tiles = new Array(parseInt(arrayBuffer.byteLength / Map.TilePhysic.byteLength))
        for (let i=0; i<this.tiles.length; i++) {
            this.tiles[i] = new Map.TilePhysic(arrayBuffer.slice(i*Map.TilePhysic.byteLength, (i+1)*Map.TilePhysic.byteLength))
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
Map.TilePhysic = class {
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
Map.SpriteSheetsIds = [0, 1043, 1042, 1043, 1042, 1043, 1042, 1043, 1042, 1043, 1042, 1043, 1043, 2315, 1183, 1096, 1186, 1181, 2323, 2331, 2332, 2333, 2271, 2272, 2273, 2274, 2275, 2276, 2277, 2318, 2270, 2329, 1810, 1784, 1785, 1813, 1919, 1812, 2009, 1956, 2008, 2316, 2317, 0, 0, 0, 1102, 1911, 2313, 1103, 1451, 1901, 1900, 1112, 1411, 1111, 1109, 1104, 1105, 1107, 1632, 0, 1910, 1110, 1101, 1098, 1097, 1108, 1786, 1909, 1099, 1912, 1537, 1538, 1539, 1544, 1545, 1546, 1000, 1001, 2020, 1971, 1972, 2169, 2172, 1002, 1003, 1081, 1082, 1722, 1720, 1721, 1059, 1060, 1702, 1703, 1061, 1080, 1075, 1076, 1052, 2330, 1055, 1051, 1054, 1057, 1058, 1960, 2055, 1970, 2007, 2170, 1765, 2319, 1635, 1973, 1636, 1634, 1969, 1637, 2251, 1045, 1047, 1048, 1044, 1049, 1046, 1757, 1758, 1760, 1962, 1050, 1759, 1763, 1963, 1407, 1761, 1762, 1961, 1392, 1393, 1394, 1395, 1396, 1397, 1398, 1399, 1113, 1113, 1114, 1114, 1955, 1955, 1115, 1115, 1115, 1116, 1116, 1117, 1118, 1119, 1120, 1926, 1926, 1926, 1121, 1121, 1121, 1121, 1122, 1122, 1122, 1122, 1123, 1123, 1123, 1124, 1124, 1124, 1125, 1126, 1127, 2229, 2229, 1723, 1723, 1723, 1724, 1724, 1724, 1725, 1725, 1725, 1751, 1751, 1751, 1799, 1799, 1800, 1801, 1803, 1914, 1915, 1916, 1128, 1128, 1128, 1129, 1130, 1130, 1701, 1701, 1131, 1131, 1132, 1133, 1133, 1134, 1134, 1135, 1136, 1137, 1137, 1137, 1137, 1138, 1138, 1139, 1140, 1141, 1141, 1141, 1142, 1142, 1142, 1143, 1143, 1143, 1144, 1144, 1145, 1145, 1146, 1146, 1146, 1924, 1924, 1924, 1951, 1147, 1147, 1147, 1147, 1949, 1950, 1950, 1950, 1392, 1393, 1394, 1396, 1398, 1092, 2052, 1755, 1755, 1091, 1091, 1094, 1708, 1094, 1094, 1708, 1094, 1708, 1094, 1708, 1094, 1708, 1821, 1821, 1821, 1964, 1977, 1977, 1977, 2238, 2238, 1088, 1088, 1088, 1090, 1090, 1090, 1095, 1095, 1095, 1089, 1089, 1093, 1093, 1943, 1943, 1336, 1987, 1988, 1989, 1990, 1991, 1339, 2304, 1339, 1339, 1339, 1638, 1638, 2004, 2004, 2161, 1709, 1709, 1713, 1641, 1641, 1641, 1641, 1018, 1012, 1020, 1019, 1019, 1019, 1016, 1016, 1011, 1011, 1404, 1013, 1014, 1015, 1727, 1726, 1022, 1752, 1929, 1715, 1932, 1021, 1753, 2237, 1935, 1153, 1154, 1155, 1957, 1063, 1062, 1149, 1148, 1639, 1754, 1717, 2171, 1026, 1027, 1028, 1029, 1023, 1024, 1025, 1064, 1065, 1066, 1004, 1078, 2234, 2235, 2236, 1079, 1074, 1073, 1072, 1071, 1424, 1072, 1071, 1423, 1422, 1897, 1898, 1899, 1897, 1898, 1718, 1933, 1934, 1795, 1697, 1699, 1698, 2231, 2232, 2233, 1067, 1068, 1069, 1070, 1083, 1084, 2165, 2168, 1086, 1981, 1087, 2054, 2164, 1796, 1033, 2021, 1034, 1035, 1337, 2303, 1036, 1038, 1037, 1032, 1032, 1031, 1425, 1030, 1040, 2000, 2003, 1150, 1151, 1152, 1451, 1426, 1427, 1428, 1429, 1430, 1431, 1432, 1433, 1434, 1435, 1436, 1437, 1438, 1439, 1440, 1441, 1503, 1547, 1548, 1769, 1770, 1442, 1443, 1444, 1445, 1446, 1447, 1448, 1449, 1450, 1451, 1452, 1453, 1454, 1455, 1456, 1457, 1504, 1549, 1550, 1771, 1772, 1823, 1824, 1825, 1826, 1827, 1828, 1829, 1830, 1831, 1832, 1833, 1834, 1835, 1836, 1837, 1838, 1839, 1840, 1841, 1842, 1843, 1505, 1506, 1507, 1508, 1509, 1510, 1511, 1512, 1513, 1514, 1515, 1516, 1517, 1519, 1535, 1540, 1541, 1975, 1520, 1521, 1522, 1523, 1524, 1525, 1526, 1527, 1528, 1529, 1530, 1531, 1532, 1534, 1536, 1542, 1543, 1976, 1862, 1863, 1864, 1865, 1866, 1867, 1868, 1869, 1870, 1871, 1872, 1873, 1874, 1920, 1875, 1876, 1877, 1878, 1974, 1591, 1592, 1593, 1594, 1595, 1596, 1597, 1598, 1599, 1600, 1601, 1814, 1602, 1603, 1604, 1605, 1606, 1623, 1815, 1773, 1607, 1608, 1609, 1610, 1611, 1612, 1613, 1614, 1615, 1616, 1617, 1816, 1618, 1619, 1620, 1621, 1622, 1624, 1817, 1774, 1879, 1880, 1881, 1882, 1883, 1884, 1885, 1886, 1887, 1888, 1889, 2312, 1890, 1891, 1892, 1893, 1894, 1895, 2244, 1896, 1678, 1679, 1680, 1681, 1682, 1683, 1684, 1685, 1686, 1687, 1688, 1689, 1690, 1691, 1692, 1693, 1694, 1705, 1661, 1662, 1663, 1664, 1665, 1666, 1667, 1668, 1669, 1670, 1671, 1672, 1673, 1674, 1675, 1676, 1677, 1704, 1844, 1845, 1846, 1847, 1848, 1849, 1850, 1851, 1852, 1853, 1854, 1855, 1856, 1857, 1858, 1859, 1860, 1861, 2050, 2159, 2051, 2160, 2049, 2158, 2031, 2090, 2091, 2092, 2093, 2193, 2194, 2040, 2124, 2125, 2126, 2127, 2211, 2212, 2022, 2056, 2057, 2058, 2059, 2175, 2176, 2032, 2094, 2095, 2096, 2097, 2195, 2196, 2041, 2128, 2129, 2130, 2131, 2213, 2214, 2023, 2060, 2061, 2062, 2063, 2177, 2178, 2033, 2098, 2099, 2100, 2101, 2197, 2198, 2042, 2132, 2133, 2134, 2135, 2215, 2216, 2024, 2064, 2065, 2066, 2067, 2179, 2180, 2034, 2102, 2103, 2104, 2105, 2199, 2200, 2043, 2136, 2137, 2138, 2139, 2217, 2218, 2025, 2068, 2069, 2070, 2071, 2181, 2182, 2035, 2106, 2107, 2108, 2109, 2201, 2202, 2044, 2140, 2141, 2142, 2143, 2219, 2220, 2026, 2072, 2073, 2074, 2075, 2183, 2184, 2036, 2110, 2111, 2112, 2113, 2203, 2204, 2045, 2144, 2145, 2146, 2147, 2221, 2222, 2027, 2076, 2077, 2078, 2079, 2185, 2186, 2037, 2114, 2115, 2116, 2205, 2206, 2046, 2148, 2149, 2150, 2223, 2224, 2028, 2080, 2081, 2082, 2187, 2188, 2038, 2117, 2118, 2119, 2120, 2207, 2208, 2047, 2151, 2152, 2153, 2154, 2225, 2226, 2029, 2083, 2084, 2085, 2086, 2189, 2190, 2039, 2121, 2122, 2123, 2209, 2210, 2048, 2155, 2156, 2157, 2227, 2228, 2030, 2087, 2088, 2089, 2191, 2192, 2259, 2260, 2261, 2262, 2263, 2264, 2265, 2266, 2267, 2268, 2254, 2255, 2256, 2257, 2258, 1408, 1410, 1409, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
Map.SpriteSheets = {
    1092: {
        sizeX: 160,
        sizeY: 160,
        rows: 4,
        columns: 16
    },
    1020: {
        sizeX: 80,
        sizeY: 80,
        rows: 4,
        columns: 2
    },
    1052: {
        sizeX: 32,
        sizeY: 32,
        rows: 8,
        columns: 4
    },
    1635: {
        sizeX: 32,
        sizeY: 32,
        rows: 8,
        columns: 10
    },
    1636: {
        sizeX: 64,
        sizeY: 64,
        rows: 8,
        columns: 8
    },
    1055: {
        sizeX: 64,
        sizeY: 64,
        rows: 4,
        columns: 7
    },
    1033: {
        sizeX: 64,
        sizeY: 64,
        rows: 4,
        columns: 4
    },
    1022: {
        sizeX: 64,
        sizeY: 64,
        rows: 4,
        columns: 10
    },
    1059: {
        sizeX: 32,
        sizeY: 32,
        rows: 16,
        columns: 5
    },
    1060: {
        sizeX: 64,
        sizeY: 64,
        rows: 8,
        columns: 4
    },
    1061: {
        sizeX: 64,
        sizeY: 128,
        rows: 8,
        columns: 1
    },
    1153: {
        sizeX: 320,
        sizeY: 320,
        rows: 2,
        columns: 1
    },
    1063: {
        sizeX: 80,
        sizeY: 80,
        rows: 4,
        columns: 6
    },
    1154: {
        sizeX: 352,
        sizeY: 288,
        rows: 1,
        columns: 1
    },
    1155: {
        sizeX: 160,
        sizeY: 160,
        rows: 2,
        columns: 1
    },
    1062: {
        sizeX: 48,
        sizeY: 48,
        rows: 4,
        columns: 3
    },
    1088: {
        sizeX: 80,
        sizeY: 80,
        rows: 4,
        columns: 8
    },
    1094: {
        sizeX: 80,
        sizeY: 80,
        rows: 4,
        columns: 12
    },
    2237: {
        sizeX: 96,
        sizeY: 96,
        rows: 8,
        columns: 2
    },
    1113: {
        sizeX: 80,
        sizeY: 80,
        rows: 8,
        columns: 4
    },
    1131: {
        sizeX: 80,
        sizeY: 80,
        rows: 8,
        columns: 4
    },
    1054: {
        sizeX: 32,
        sizeY: 32,
        rows: 8,
        columns: 10
    },
    1051: {
        sizeX: 128,
        sizeY: 128,
        rows: 4,
        columns: 1
    },
    1027: {
        sizeX: 64,
        sizeY: 64,
        rows: 4,
        columns: 20
    },
    1064: {
        sizeX: 192,
        sizeY: 192,
        rows: 1,
        columns: 1
    },
    1152: {
        sizeX: 80,
        sizeY: 80,
        rows: 4,
        columns: 2
    },
    1021: {
        sizeX: 64,
        sizeY: 128,
        rows: 2,
        columns: 1
    },
    1072: {
        sizeX: 64,
        sizeY: 160,
        rows: 4,
        columns: 6
    },
    1073: {
        sizeX: 64,
        sizeY: 32,
        rows: 4,
        columns: 4
    },
    1071: {
        sizeX: 128,
        sizeY: 160,
        rows: 4,
        columns: 4
    },
    1074: {
        sizeX: 64,
        sizeY: 64,
        rows: 4,
        columns: 7
    },
    1023: {
        sizeX: 128,
        sizeY: 128,
        rows: 4,
        columns: 5
    },
    1026: {
        sizeX: 40,
        sizeY: 40,
        rows: 8,
        columns: 13
    },
    1078: {
        sizeX: 64,
        sizeY: 128,
        rows: 8,
        columns: 3
    },
    1034: {
        sizeX: 64,
        sizeY: 64,
        rows: 8,
        columns: 1
    },
    1075: {
        sizeX: 64,
        sizeY: 64,
        rows: 8,
        columns: 4
    },
    1076: {
        sizeX: 128,
        sizeY: 128,
        rows: 2,
        columns: 1
    },
    1065: {
        sizeX: 320,
        sizeY: 256,
        rows: 1,
        columns: 1
    },
    1029: {
        sizeX: 80,
        sizeY: 80,
        rows: 7,
        columns: 1
    },
    1066: {
        sizeX: 128,
        sizeY: 288,
        rows: 1,
        columns: 1
    },
    1057: {
        sizeX: 64,
        sizeY: 64,
        rows: 4,
        columns: 19
    },
    1149: {
        sizeX: 96,
        sizeY: 96,
        rows: 4,
        columns: 1
    },
    1044: {
        sizeX: 128,
        sizeY: 128,
        rows: 4,
        columns: 2
    },
    1045: {
        sizeX: 64,
        sizeY: 64,
        rows: 8,
        columns: 4
    },
    1047: {
        sizeX: 64,
        sizeY: 64,
        rows: 8,
        columns: 4
    },
    1050: {
        sizeX: 64,
        sizeY: 64,
        rows: 8,
        columns: 4
    },
    1049: {
        sizeX: 128,
        sizeY: 160,
        rows: 4,
        columns: 1
    },
    1048: {
        sizeX: 64,
        sizeY: 128,
        rows: 4,
        columns: 2
    },
    1095: {
        sizeX: 80,
        sizeY: 80,
        rows: 4,
        columns: 12
    },
    1090: {
        sizeX: 96,
        sizeY: 96,
        rows: 4,
        columns: 14
    },
    1089: {
        sizeX: 80,
        sizeY: 80,
        rows: 4,
        columns: 8
    },
    1128: {
        sizeX: 80,
        sizeY: 96,
        rows: 5,
        columns: 2
    },
    1130: {
        sizeX: 80,
        sizeY: 96,
        rows: 4,
        columns: 2
    },
    1147: {
        sizeX: 80,
        sizeY: 96,
        rows: 4,
        columns: 2
    },
    1143: {
        sizeX: 80,
        sizeY: 96,
        rows: 4,
        columns: 2
    },
    1144: {
        sizeX: 80,
        sizeY: 96,
        rows: 4,
        columns: 2
    },
    1145: {
        sizeX: 80,
        sizeY: 96,
        rows: 4,
        columns: 2
    },
    1121: {
        sizeX: 80,
        sizeY: 96,
        rows: 8,
        columns: 4
    },
    1122: {
        sizeX: 80,
        sizeY: 96,
        rows: 8,
        columns: 4
    },
    1115: {
        sizeX: 80,
        sizeY: 80,
        rows: 8,
        columns: 4
    },
    1116: {
        sizeX: 80,
        sizeY: 80,
        rows: 8,
        columns: 4
    },
    1133: {
        sizeX: 80,
        sizeY: 80,
        rows: 8,
        columns: 4
    },
    1134: {
        sizeX: 80,
        sizeY: 80,
        rows: 8,
        columns: 4
    },
    1137: {
        sizeX: 80,
        sizeY: 96,
        rows: 4,
        columns: 2
    },
    1138: {
        sizeX: 80,
        sizeY: 96,
        rows: 4,
        columns: 2
    },
    1123: {
        sizeX: 80,
        sizeY: 96,
        rows: 8,
        columns: 4
    },
    1141: {
        sizeX: 80,
        sizeY: 128,
        rows: 4,
        columns: 2
    },
    1091: {
        sizeX: 160,
        sizeY: 160,
        rows: 4,
        columns: 16
    },
    1124: {
        sizeX: 80,
        sizeY: 96,
        rows: 5,
        columns: 2
    },
    1018: {
        sizeX: 32,
        sizeY: 32,
        rows: 4,
        columns: 8
    },
    1943: {
        sizeX: 128,
        sizeY: 128,
        rows: 8,
        columns: 10
    },
    1012: {
        sizeX: 48,
        sizeY: 48,
        rows: 4,
        columns: 2
    },
    1028: {
        sizeX: 64,
        sizeY: 64,
        rows: 8,
        columns: 1
    },
    1024: {
        sizeX: 128,
        sizeY: 128,
        rows: 4,
        columns: 2
    },
    1046: {
        sizeX: 192,
        sizeY: 160,
        rows: 1,
        columns: 1
    },
    1058: {
        sizeX: 192,
        sizeY: 128,
        rows: 1,
        columns: 1
    },
    1148: {
        sizeX: 80,
        sizeY: 48,
        rows: 2,
        columns: 1
    },
    1114: {
        sizeX: 80,
        sizeY: 80,
        rows: 8,
        columns: 4
    },
    1146: {
        sizeX: 80,
        sizeY: 96,
        rows: 4,
        columns: 3
    },
    1129: {
        sizeX: 80,
        sizeY: 96,
        rows: 4,
        columns: 2
    },
    1016: {
        sizeX: 64,
        sizeY: 64,
        rows: 8,
        columns: 4
    },
    1011: {
        sizeX: 32,
        sizeY: 32,
        rows: 5,
        columns: 2
    },
    1067: {
        sizeX: 64,
        sizeY: 224,
        rows: 8,
        columns: 3
    },
    1068: {
        sizeX: 64,
        sizeY: 64,
        rows: 8,
        columns: 3
    },
    1025: {
        sizeX: 192,
        sizeY: 192,
        rows: 4,
        columns: 1
    },
    1070: {
        sizeX: 128,
        sizeY: 224,
        rows: 2,
        columns: 1
    },
    1069: {
        sizeX: 192,
        sizeY: 256,
        rows: 2,
        columns: 1
    },
    1339: {
        sizeX: 128,
        sizeY: 128,
        rows: 4,
        columns: 14
    },
    1407: {
        sizeX: 128,
        sizeY: 128,
        rows: 4,
        columns: 2
    },
    1634: {
        sizeX: 128,
        sizeY: 128,
        rows: 3,
        columns: 1
    },
    1637: {
        sizeX: 96,
        sizeY: 96,
        rows: 4,
        columns: 2
    },
    1638: {
        sizeX: 96,
        sizeY: 96,
        rows: 8,
        columns: 10
    },
    1142: {
        sizeX: 80,
        sizeY: 128,
        rows: 4,
        columns: 2
    },
    1639: {
        sizeX: 128,
        sizeY: 128,
        rows: 4,
        columns: 1
    },
    1641: {
        sizeX: 160,
        sizeY: 128,
        rows: 4,
        columns: 18
    },
    1697: {
        sizeX: 80,
        sizeY: 96,
        rows: 1,
        columns: 1
    },
    1698: {
        sizeX: 512,
        sizeY: 512,
        rows: 1,
        columns: 9
    },
    1699: {
        sizeX: 32,
        sizeY: 96,
        rows: 11,
        columns: 1
    },
    1701: {
        sizeX: 80,
        sizeY: 96,
        rows: 4,
        columns: 2
    },
    1702: {
        sizeX: 192,
        sizeY: 160,
        rows: 1,
        columns: 1
    },
    1703: {
        sizeX: 128,
        sizeY: 160,
        rows: 1,
        columns: 1
    },
    1709: {
        sizeX: 96,
        sizeY: 96,
        rows: 8,
        columns: 8
    },
    2171: {
        sizeX: 128,
        sizeY: 224,
        rows: 4,
        columns: 1
    },
    1715: {
        sizeX: 128,
        sizeY: 160,
        rows: 6,
        columns: 1
    },
    1718: {
        sizeX: 96,
        sizeY: 192,
        rows: 6,
        columns: 1
    },
    1723: {
        sizeX: 80,
        sizeY: 96,
        rows: 5,
        columns: 2
    },
    1724: {
        sizeX: 80,
        sizeY: 96,
        rows: 5,
        columns: 2
    },
    1725: {
        sizeX: 80,
        sizeY: 96,
        rows: 5,
        columns: 2
    },
    1019: {
        sizeX: 128,
        sizeY: 128,
        rows: 4,
        columns: 2
    },
    1751: {
        sizeX: 80,
        sizeY: 128,
        rows: 4,
        columns: 2
    },
    1752: {
        sizeX: 256,
        sizeY: 64,
        rows: 1,
        columns: 1
    },
    1753: {
        sizeX: 128,
        sizeY: 160,
        rows: 4,
        columns: 1
    },
    1754: {
        sizeX: 128,
        sizeY: 160,
        rows: 3,
        columns: 1
    },
    1755: {
        sizeX: 160,
        sizeY: 160,
        rows: 4,
        columns: 14
    },
    1765: {
        sizeX: 64,
        sizeY: 64,
        rows: 10,
        columns: 2
    },
    1795: {
        sizeX: 64,
        sizeY: 160,
        rows: 6,
        columns: 1
    },
    1799: {
        sizeX: 80,
        sizeY: 96,
        rows: 4,
        columns: 2
    },
    1800: {
        sizeX: 80,
        sizeY: 96,
        rows: 4,
        columns: 2
    },
    1803: {
        sizeX: 80,
        sizeY: 96,
        rows: 4,
        columns: 2
    },
    1897: {
        sizeX: 64,
        sizeY: 160,
        rows: 4,
        columns: 6
    },
    1898: {
        sizeX: 128,
        sizeY: 160,
        rows: 4,
        columns: 4
    },
    1924: {
        sizeX: 80,
        sizeY: 96,
        rows: 4,
        columns: 2
    },
    1929: {
        sizeX: 32,
        sizeY: 32,
        rows: 10,
        columns: 1
    },
    1933: {
        sizeX: 64,
        sizeY: 160,
        rows: 7,
        columns: 1
    },
    1934: {
        sizeX: 64,
        sizeY: 160,
        rows: 12,
        columns: 1
    },
    1932: {
        sizeX: 80,
        sizeY: 80,
        rows: 4,
        columns: 2
    },
    1935: {
        sizeX: 192,
        sizeY: 160,
        rows: 1,
        columns: 1
    },
    1821: {
        sizeX: 128,
        sizeY: 128,
        rows: 8,
        columns: 8
    },
    1949: {
        sizeX: 80,
        sizeY: 80,
        rows: 2,
        columns: 1
    },
    1955: {
        sizeX: 80,
        sizeY: 80,
        rows: 8,
        columns: 4
    },
    1926: {
        sizeX: 80,
        sizeY: 80,
        rows: 8,
        columns: 4
    },
    1957: {
        sizeX: 320,
        sizeY: 320,
        rows: 2,
        columns: 1
    },
    1969: {
        sizeX: 192,
        sizeY: 128,
        rows: 1,
        columns: 1
    },
    1973: {
        sizeX: 32,
        sizeY: 32,
        rows: 6,
        columns: 8
    },
    1977: {
        sizeX: 128,
        sizeY: 128,
        rows: 8,
        columns: 6
    },
    2004: {
        sizeX: 80,
        sizeY: 80,
        rows: 8,
        columns: 8
    },
    2052: {
        sizeX: 160,
        sizeY: 160,
        rows: 4,
        columns: 16
    },
    2229: {
        sizeX: 80,
        sizeY: 96,
        rows: 4,
        columns: 2
    },
    2231: {
        sizeX: 128,
        sizeY: 64,
        rows: 4,
        columns: 8
    },
    2232: {
        sizeX: 64,
        sizeY: 192,
        rows: 9,
        columns: 1
    },
    2233: {
        sizeX: 160,
        sizeY: 192,
        rows: 4,
        columns: 1
    },
    2234: {
        sizeX: 64,
        sizeY: 192,
        rows: 11,
        columns: 1
    },
    2235: {
        sizeX: 160,
        sizeY: 192,
        rows: 6,
        columns: 1
    },
    2236: {
        sizeX: 128,
        sizeY: 128,
        rows: 2,
        columns: 1
    },
    2238: {
        sizeX: 128,
        sizeY: 128,
        rows: 4,
        columns: 12
    },
    2319: {
        sizeX: 64,
        sizeY: 64,
        rows: 3,
        columns: 6
    },
    2330: {
        sizeX: 32,
        sizeY: 32,
        rows: 16,
        columns: 3
    }
}
Map.TileMaterial = {
    Grass      : 1,
    EchoStone  : 2,
    WoodPlat   : 3,
    StonePlat  : 4,
    TowerStone : 5,
    Wood       : 6,
    Stone      : 7
}
Object.freeze(Map.SpriteSheetsIds)
Object.freeze(Map.SpriteSheets)
Object.freeze(Map.TileMaterial)
Map.displayData = (element, dataAsArrayBuffer) => {
    const map = new Map(dataAsArrayBuffer)
    Map.displayDataFromMap(element, map)
    return map
}
Map.displayDataFromMap = (element, map) => {
    element.innerHTML = ''
    element.style.width = map.widthPixel / 100 + 'px'
    element.style.height = map.heightPixel / 100 + 'px'
    if (map.backgroundImage) {
        const background = document.createElement('div')
        background.classList.add('background')
        background.style.backgroundImage = 'url(images/'+Map.SpriteSheetsIds[map.backgroundImage]+'.png)'
        element.appendChild(background)
    }
    if (map.mapParallaxFront.image) {
        const parallaxFront = document.createElement('div')
        parallaxFront.classList.add('parallax')
        parallaxFront.classList.add('front')
        // parallaxFront.style.backgroundPositionY = map.mapParallaxFront.offsetY + 'px'
        parallaxFront.style.backgroundImage = 'url(images/'+Map.SpriteSheetsIds[map.mapParallaxFront.image]+'.png)'
        element.appendChild(parallaxFront)
    }
    if (map.mapParallaxBack.image) {
        const parallaxBack = document.createElement('div')
        parallaxBack.classList.add('parallax')
        parallaxBack.classList.add('back')
        // parallaxBack.style.backgroundPositionY = map.mapParallaxBack.offsetY + 'px'
        parallaxBack.style.backgroundImage = 'url(images/'+Map.SpriteSheetsIds[map.mapParallaxBack.image]+'.png)'
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
                    d.style.backgroundImage = 'url(images/'+Map.SpriteSheetsIds[t.spriteSheet]+'.png)'
                    const s = Map.SpriteSheets[Map.SpriteSheetsIds[t.spriteSheet]]
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