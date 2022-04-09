const path = require('path')
const fs = require('fs')
const ts = require('typescript')
const {SCRIPT_EXT} = require('./constants')

function unIndent(strings, ...values) {
    const text = strings
        .map((s, i) => (i === 0 ? s : values[i - 1]))
        .join('')
    const lines = text.replace(/^\n/u, '').replace(/\n\s*$/u, '').split('\n')
    const lineIndents = lines.filter(line => line.trim()).map(line => line.match(/ */u)[0].length)
    const minLineIndent = Math.min(...lineIndents)

    return lines.map(line => line.slice(minLineIndent)).join('\n')
}

function ensureLeadingSlash(path) {
    if (path == null) {
        return ''
    }
    return path.charAt(0) === '/' ? path : '/' + path
}

function resolveScriptPath(filePath, extArrs = SCRIPT_EXT) {
    const taroEnv = 'h5'
    for (let i = 0; i < extArrs.length; i++) {
        const item = extArrs[i]
        if (taroEnv) {
            if (fs.existsSync(`${filePath}.${taroEnv}${item}`)) {
                return `${filePath}.${taroEnv}${item}`
            }
            if (fs.existsSync(`${filePath}${path.sep}index.${taroEnv}${item}`)) {
                return `${filePath}${path.sep}index.${taroEnv}${item}`
            }
            if (fs.existsSync(`${filePath.replace(/\/index$/, `.${taroEnv}/index`)}${item}`)) {
                return `${filePath.replace(/\/index$/, `.${taroEnv}/index`)}${item}`
            }
        }
        if (fs.existsSync(`${filePath}${item}`)) {
            return `${filePath}${item}`
        }
        if (fs.existsSync(`${filePath}${path.sep}index${item}`)) {
            return `${filePath}${path.sep}index${item}`
        }
    }
    return realPath
}

function parseJson(filePath) {
    const sourceText = fs.readFileSync(filePath, 'utf-8')
    const jsonFile = ts.parseJsonText(filePath, sourceText)
    return ts.convertToObject(jsonFile)
}

// Identify /[param]/ in route string
const TEST_ROUTE_PATTERN = `\\[[^/]+?\\](${SCRIPT_EXT.join('|')})$`

function isDynamicRoute(route) {
    return new RegExp(TEST_ROUTE_PATTERN).test(route)
}

module.exports = {
    unIndent,
    ensureLeadingSlash,
    resolveScriptPath,
    parseJson,
    isDynamicRoute
}
