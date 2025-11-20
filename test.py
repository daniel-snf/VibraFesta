from PIL import Image

# Colores
GREEN = (0x76, 0x82, 0x3A)  # #76823A

# Cargar el logo
img = Image.open("img/logo.png").convert("RGBA")
pixels = img.getdata()

new_pixels = []
for r, g, b, a in pixels:
    # Mantener transparencia
    if a == 0:
        new_pixels.append((r, g, b, a))
        continue

    # Detectar "blancos" (el texto)
    if r > 230 and g > 230 and b > 230:
        new_pixels.append((*GREEN, a))   # texto en verde
    else:
        new_pixels.append((r, g, b, a))  # puntito rosa + fondo negro igual

img.putdata(new_pixels)
img.save("logo_vibra_verde.png")
