// A deliberately small, escaped Markdown subset for trusted repository documentation.
// Supports headings, paragraphs, flat lists, fences, tables, quotes, links and emphasis.
export const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const slug=s=>s.toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-');
function safeLink(href) {
  if (/^(https?:\/\/|#|\.?\.?\/|[a-z0-9_-])/i.test(href) && !/^[a-z][a-z0-9+.-]*:/i.test(href.replace(/^https?:/i,'')) && !href.startsWith('//')) return href.includes('/downloads/') ? href : href.replace(/\.md(?=#|$)/,'.html');
  return '#';
}
export function inline(source) {
  const tokens=[];
  const token=html=>{tokens.push(html);return `\u0000${tokens.length-1}\u0000`;};
  let text=source.replace(/`([^`]+)`/g,(_,s)=>token(`<code>${escapeHtml(s)}</code>`));
  text=text.replace(/\[([^\]]+)\]\(([^\s)]+)\)/g,(_,label,href)=>token(`<a href="${escapeHtml(safeLink(href))}">${escapeHtml(label)}</a>`));
  text=escapeHtml(text).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  return text.replace(/\u0000(\d+)\u0000/g,(_,i)=>tokens[Number(i)]);
}
export function renderMarkdown(markdown) {
  const lines=markdown.replace(/\r/g,'').split('\n');const out=[];let i=0;const ids=new Map();
  while(i<lines.length){
    let line=lines[i];
    if(!line.trim()){i++;continue;}
    if(line.startsWith('```')){const lang=line.slice(3).trim();const code=[];i++;while(i<lines.length&&!lines[i].startsWith('```'))code.push(lines[i++]);i++;out.push(`<pre><code class="language-${escapeHtml(lang)}">${escapeHtml(code.join('\n'))}</code></pre>`);continue;}
    const heading=line.match(/^(#{1,3}) (.+)/);
    if(heading){const base=slug(heading[2]);const count=ids.get(base)||0;ids.set(base,count+1);out.push(`<h${heading[1].length} id="${base}${count?'-'+count:''}">${inline(heading[2])}</h${heading[1].length}>`);i++;continue;}
    if(line.startsWith('|')&&/^\|[\s:|-]+\|$/.test(lines[i+1]||'')){
      const cells=s=>s.trim().replace(/^\||\|$/g,'').split('|').map(x=>x.trim());
      out.push('<div class="table-scroll" role="region" aria-label="Documentation table" tabindex="0"><table><thead><tr>'+cells(line).map(c=>`<th scope="col">${inline(c)}</th>`).join('')+'</tr></thead><tbody>');i+=2;
      while(i<lines.length&&lines[i].startsWith('|')){out.push('<tr>'+cells(lines[i++]).map(c=>`<td>${inline(c)}</td>`).join('')+'</tr>');}out.push('</tbody></table></div>');continue;
    }
    if(/^(?:- |\d+\. )/.test(line)){const ordered=/^\d/.test(line);const pattern=ordered?/^\d+\. /:/^- /;out.push(ordered?'<ol>':'<ul>');while(i<lines.length&&pattern.test(lines[i]))out.push(`<li>${inline(lines[i++].replace(pattern,''))}</li>`);out.push(ordered?'</ol>':'</ul>');continue;}
    if(line.startsWith('> ')){const quote=[];while(i<lines.length&&lines[i].startsWith('> '))quote.push(lines[i++].slice(2));out.push(`<blockquote><p>${inline(quote.join(' '))}</p></blockquote>`);continue;}
    const para=[line];i++;while(i<lines.length&&lines[i].trim()&&!/^(#|\||```|> |(?:- |\d+\. ))/.test(lines[i]))para.push(lines[i++]);out.push(`<p>${inline(para.join(' '))}</p>`);
  }
  return out.join('\n');
}
