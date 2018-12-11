var	la, lang = document.documentElement.lang || 'en'
,	regSpace		= /\s+/g
,	regNewLine		= /[\r\n]+/g
,	regTrim			= /^\s+|\s+$/g
,	regTrimMultiplier	= /^[x\s:]+|[x\s:]+$/g
,	regRandomLine		= /^(?:(\d+)(?:\s*-\s*(\d+))?\b\s*)?(.*?)$/
;

if (lang == 'ru') la = {
	'generate': 'Создать персонажа'
,	'cleanup': 'Удалить результаты'
,	'skip_value': 'нет'
};
else la = {
	'generate': 'Generate a character'
,	'cleanup': 'Remove results'
,	'skip_value': 'none'
};

//* Utility functions *--------------------------------------------------------

function gc(n,p) {try {return Array.prototype.slice.call((p || document).getElementsByClassName(n) || []);} catch(e) {return [];}}
function gt(n,p) {try {return Array.prototype.slice.call((p || document).getElementsByTagName(n) || []);} catch(e) {return [];}}
function gn(n,p) {try {return Array.prototype.slice.call((p || document).getElementsByName(n) || []);} catch(e) {return [];}}
function gi(n,p) {try {return Array.prototype.slice.call((p || document).getElementsById(n) || []);} catch(e) {return [];}}
function id(i) {return document.getElementById(i);}
function cre(e,p,b) {
	e = document.createElement(e);
	if (b) p.insertBefore(e, b); else
	if (p) p.appendChild(e);
	return e;
}

function del(e) {
	if (!e) return;
	if (e.substr) e = gt(e);
	if (e.map) e.map(del); else
	if (p = e.parentNode) p.removeChild(e);
	return p;
}

function orz(n) {return parseInt(n || 0) || 0;}
function trim(text) {return text.replace(regTrim, '');}
function arrayFilterNonEmptyValues(v) {return !!v;}
function arrayFilterUniqueValues(v,i,a) {return a.indexOf(v) === i;}

//* Page-specific functions *--------------------------------------------------

function cleanup(e) {
	del('p');
}

function generate(e,n) {
	n = orz(n);
	if (n < 1) n = 1;
	while (n--) generateOne(e);
}

function generateOne(e) {
var	result = [];

	gt('textarea').map(
		function(e) {
		var	a = (
				('' + e.value)
				.split(regNewLine)
				.map(trim)
				.filter(arrayFilterNonEmptyValues)
				.filter(arrayFilterUniqueValues)
			)
		,	b = []
		,	totalWeight = a.reduce(
				function(prev, line) {
				var	match = line.match(regRandomLine);

					if (match) {
					var	weight = Math.max(1, orz(match[1]))
					,	text = (match[3] || '').replace(regSpace, ' ')
					,	max = prev + weight
						;
						
						b.push({
							'min': prev
						,	'max': prev + weight
						,	'text': text
						});
					}

					return max || prev;
				}
			,	0
			)
		,	randomNumber = Math.floor(Math.random() * totalWeight)
		,	line
		,	i = b.length
			;

			console.log(
				'Roll: ' + [
					e.id + ' = ' + randomNumber
				,	'[' + 0
				,	totalWeight + ')'
				].join(', ')
			);

			while (i--) if (
				(line = b[i])
			&&	randomNumber >= line.min
			&&	randomNumber <  line.max
			) {
			var	text = line.text;

				console.log(
					'Selected: ' + [
						text
					,	'[' + line.min
					,	line.max + ')'
					].join(', ')
				);

				if (text && text !== la.skip_value) result.push(text);

				return;
			}
		}
	);

	if (result.length > 0) {
		console.log('+ Result: ' + result.join(', '));

		cre('p', e.parentNode).innerHTML = result.map(
			function(v) {
				return (
					'<span>'
				+		v
				+	'</span>'
				);
			}
		).join(', ');
	}
}

function init() {
	cre('div', document.body).innerHTML = (
		'<button onclick="generate(this)">'
	+		la.generate
	+	'</button>'
	+	'<button onclick="cleanup(this)">'
	+		la.cleanup
	+	'</button>'
	);

	gt('button')[0].click();
}

//* Runtime *------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', init, false);
