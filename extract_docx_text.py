import zipfile
import xml.etree.ElementTree as ET
path = r'C:\Users\adars\OneDrive\Desktop\UK\UK_playwright_JS\QAssementAutomation_-2026Jan.docx'
with zipfile.ZipFile(path) as z:
    xml = z.read('word/document.xml')
root = ET.fromstring(xml)
ns = {'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
paragraphs = []
for p in root.findall('.//w:p', ns):
    texts = [t.text for t in p.findall('.//w:t', ns) if t.text]
    if texts:
        paragraphs.append(''.join(texts))
for i, p in enumerate(paragraphs[:200], 1):
    print(f'{i:03}: {p}')
