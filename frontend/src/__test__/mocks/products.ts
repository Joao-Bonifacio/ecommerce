export const mockProducts = [
  {
    id: expect(crypto.randomUUID()),
    slug: 'highlight-product',
    image: 'http://localhost:8080/img/highlight.jpg',
    title: 'Highlight Product',
    price: 999,
  },
  {
    id: expect(crypto.randomUUID()),
    slug: 'second-product',
    image: 'http://localhost:8080/img/second.jpg',
    title: 'Second Product',
    price: 499,
  },
  {
    id: expect(crypto.randomUUID()),
    slug: 'third-product',
    image: 'http://localhost:8080/img/third.jpg',
    title: 'Third Product',
    price: 299,
  },
]
