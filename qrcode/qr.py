import qrcode

url = input("Enter text or URL to generate QR code: ")

img = qrcode.make(url)

img.save("qrcode.png")
print("QR code Created")