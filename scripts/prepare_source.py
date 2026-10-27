from pathlib import Path
import re

root = Path(__file__).resolve().parents[1] / 'dist'
source = '\n'.join((root/name).read_text(encoding='utf-8') for name in ['index.html','styles.css','app.js'])
names = set(re.findall(r'[A-Za-z0-9_\-]+\.(?:png|jpeg|jpg|woff2?|ttf)', source))
missing = [name for name in names if not (root/'assets'/name).is_file()]
print({'referenced_media':len(names),'missing':missing})
assert not missing

# Keep the authored stylesheet readable without changing its rules.
css = (root/'styles.css').read_text(encoding='utf-8')
indent, line, lines = 0, '', []
for token in re.split(r'([{};])', css):
    if token == '{':
        lines.append('  '*indent + line.strip() + ' {')
        indent += 1
        line = ''
    elif token == '}':
        if line.strip(): lines.append('  '*indent + line.strip() + ';')
        indent -= 1
        lines.append('  '*indent + '}')
        line = ''
    elif token == ';':
        if line.strip(): lines.append('  '*indent + line.strip() + ';')
        line = ''
    else:
        line += token
assert indent == 0
(root/'styles.css').write_text('\n'.join(lines)+'\n', encoding='utf-8')
print('Stylesheet formatted. Media references verified.')
