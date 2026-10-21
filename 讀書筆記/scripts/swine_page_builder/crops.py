import pymupdf, io, sys
from PIL import Image
def crop(pdf, p, out, maxw=900, mode='union', idx=None):
    d=pymupdf.open(pdf); pg=d[p-1]
    rs=[r for im in pg.get_images(full=True) for r in pg.get_image_rects(im[0]) if r.width<700 and r.width>40]
    if mode=='largest': rs=[max(rs,key=lambda r:r.width*r.height)]
    if idx is not None: rs=[sorted(rs,key=lambda r:(r.y0,r.x0))[idx]]
    u=rs[0]
    for r in rs[1:]: u|=r
    im=Image.open(io.BytesIO(pg.get_pixmap(dpi=150,clip=u).tobytes('png'))).convert('RGB'); im.thumbnail((maxw,maxw)); im.save(out,quality=82); return im.size
