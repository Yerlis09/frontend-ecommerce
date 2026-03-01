import type { ProductResponseDto } from '../types/product.types';

/**
 * Mock de productos en el formato exacto que devuelve el backend.
 * GET /api/v1/products → ProductResponseDto[]
 *
 * Notas de mapeo desde el frontend:
 *  - `image`         → `imgUrl`  (campo del backend)
 *  - `brand`         → incluida en `description` (el backend no tiene campo brand)
 *  - `originalPrice` → campo extra del frontend (no existe en el backend)
 *  - `discount`      → campo extra del frontend (no existe en el backend)
 *  - `reviewCount`   → campo extra del frontend (no existe en el backend)
 *  - `price`         → en pesos COP (no centavos); los pagos se envían en centavos
 */
export const mockProducts: ProductResponseDto[] = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    name: 'Apple Watch Series 9',
    description:
      'Apple Watch Series 9 — el smartwatch más avanzado de Apple con chip S9 de doble núcleo, pantalla Retina siempre activa, GPS integrado, monitoreo de salud 24/7 y resistencia al agua de 50 metros. Compatible con iPhone.',
    imgUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA_5BJOHivMyilMmRB-HxKMyIjeWu4rgrghgN1o6VEWBxc45cvRITtOi7ZaOV8PYVg4IPTcqgZ_KsoskjwlpCbrSF4VtZ4uH9KP1a0GpsIKJVPQPD44bY6dx99hplO9JOEE-9jx5nb2wGUylsDyDbISAPf6UFjAxnRYVw6gSCyVVPJUVQ0JT5P5PuqOoC7jYrfZ4NKPtsh-gWh5Edl5KPeemDo4bBZrn_nTKtNzvCZBa8xs1chDsU9Xggv4ktDD1pPt89jD3CGRDvRd',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA_5BJOHivMyilMmRB-HxKMyIjeWu4rgrghgN1o6VEWBxc45cvRITtOi7ZaOV8PYVg4IPTcqgZ_KsoskjwlpCbrSF4VtZ4uH9KP1a0GpsIKJVPQPD44bY6dx99hplO9JOEE-9jx5nb2wGUylsDyDbISAPf6UFjAxnRYVw6gSCyVVPJUVQ0JT5P5PuqOoC7jYrfZ4NKPtsh-gWh5Edl5KPeemDo4bBZrn_nTKtNzvCZBa8xs1chDsU9Xggv4ktDD1pPt89jD3CGRDvRd',
    ],
    price: 1399930,
    stock: 15,
    category: 'electronics',
    rating: 4.8,
    createdAt: '2026-02-28T10:00:00.000Z',
    updatedAt: '2026-02-28T10:00:00.000Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Sony WH-1000XM5 Headphones',
    description:
      'Sony WH-1000XM5 — auriculares inalámbricos premium con cancelación activa de ruido líder en la industria. 8 micrófonos, chip HD Noise Cancelling QN1, 30 horas de batería y carga rápida de 3 minutos.',
    imgUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBC-4GsbA-g_XXKxBtzbOWwIQEqpI1izkjl9VnL558uLmQTrj7mN7Z6R1QpYIpagjeVHwa_du4Ss9zY_QxGqBeGExIddV7drYnI44st-07v6SKeatmyb34tgY5F78VDCP2GZNl_n7-4eH1R146WDM8ZRFoNA0H6ks1orq86Ve9b77sZC5WhccmG80DTMfM1vOwMKU5u2GmmvmGjnD6VGxhkNwPifZUGBkfFj1zJhk8sv7N-fl0N20MNLDkULtcaGn9rXtntUXX4hzBu',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBC-4GsbA-g_XXKxBtzbOWwIQEqpI1izkjl9VnL558uLmQTrj7mN7Z6R1QpYIpagjeVHwa_du4Ss9zY_QxGqBeGExIddV7drYnI44st-07v6SKeatmyb34tgY5F78VDCP2GZNl_n7-4eH1R146WDM8ZRFoNA0H6ks1orq86Ve9b77sZC5WhccmG80DTMfM1vOwMKU5u2GmmvmGjnD6VGxhkNwPifZUGBkfFj1zJhk8sv7N-fl0N20MNLDkULtcaGn9rXtntUXX4hzBu',
    ],
    price: 1274150,
    stock: 25,
    category: 'electronics',
    rating: 4.9,
    createdAt: '2026-02-28T10:00:00.000Z',
    updatedAt: '2026-02-28T10:00:00.000Z',
  },
  {
    id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    name: 'Xiaomi Mi Band 7 Pro',
    description:
      'Xiaomi Mi Band 7 Pro — pulsera inteligente con pantalla AMOLED de 1.64 pulgadas, GPS integrado, monitoreo de SpO2 y frecuencia cardíaca continua, 110 modos deportivos y hasta 12 días de batería.',
    imgUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDUuwO0w16Uc_Dz8z3poM5kUlmWNnptXSCi4cuqAU7i789W3a151oNE0wsMLzH9T94xb-fOOsQgVaSqooZwyRw7jq9iyVA4uRJN27mpkXYt8zDixPoTUreq2BAsJSuBWgNaWo5dfBXa6eqWGC8Yb4gs6lnNtx1VxqpDvbMpI-h1PnnZrz-bn8q8OIIqYMSBqzY5p0pjDnO9gaHdHbsTfss_7QUAcIcCRIM5xKRvWN04EqFeFsC2NQd5O5Jjv9yxEXINnoAyNyf0TYUa',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDUuwO0w16Uc_Dz8z3poM5kUlmWNnptXSCi4cuqAU7i789W3a151oNE0wsMLzH9T94xb-fOOsQgVaSqooZwyRw7jq9iyVA4uRJN27mpkXYt8zDixPoTUreq2BAsJSuBWgNaWo5dfBXa6eqWGC8Yb4gs6lnNtx1VxqpDvbMpI-h1PnnZrz-bn8q8OIIqYMSBqzY5p0pjDnO9gaHdHbsTfss_7QUAcIcCRIM5xKRvWN04EqFeFsC2NQd5O5Jjv9yxEXINnoAyNyf0TYUa',
    ],
    price: 299900,
    stock: 50,
    category: 'electronics',
    rating: 4.5,
    createdAt: '2026-02-28T10:00:00.000Z',
    updatedAt: '2026-02-28T10:00:00.000Z',
  },
  {
    id: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
    name: 'Nike Air Zoom Pegasus 40',
    description:
      'Nike Air Zoom Pegasus 40 — zapatillas de running con amortiguación Air Zoom en el antepié, malla transpirable de ingeniería y suela de goma de alta tracción. Ideales para corredores de distancia media y larga.',
    imgUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCf_Og_Z35nLweR5wMOmjcgcomWsJfE0bcd-CfIbUWHbcsM0UkCtIjmoX2rBF4ElqkCzjC7Bf8v18yT_uBRUqFUUCmzoEPjZzmCsi1g2rKSciuCX7nGbsoo4eLAqo7YPwokoEN2XEsdEysavzcGbwMmoRj3qw9es9T3OWL3brMU3N3T8KZn6OLiMaIy30Jh5Lr7N7VPU4xaLNsku56P_YPEswH51y6s13YesPWOlwWYHZWsmpZOu-RVtK9BQOkj3kWizbUrSJgQl50n',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCf_Og_Z35nLweR5wMOmjcgcomWsJfE0bcd-CfIbUWHbcsM0UkCtIjmoX2rBF4ElqkCzjC7Bf8v18yT_uBRUqFUUCmzoEPjZzmCsi1g2rKSciuCX7nGbsoo4eLAqo7YPwokoEN2XEsdEysavzcGbwMmoRj3qw9es9T3OWL3brMU3N3T8KZn6OLiMaIy30Jh5Lr7N7VPU4xaLNsku56P_YPEswH51y6s13YesPWOlwWYHZWsmpZOu-RVtK9BQOkj3kWizbUrSJgQl50n',
    ],
    price: 449925,
    stock: 30,
    category: 'fashion',
    rating: 4.7,
    createdAt: '2026-02-28T10:00:00.000Z',
    updatedAt: '2026-02-28T10:00:00.000Z',
  },
  {
    id: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
    name: 'Fossil Grant Chronograph',
    description:
      'Fossil Grant Chronograph — reloj de caballero con diseño clásico atemporal, movimiento de cuarzo japonés, subdiales cronógrafo funcionales y resistencia al agua de 50m. Caja y brazalete de acero inoxidable.',
    imgUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDbc36un5sOXUK5ffAy5ujIhPmvKvAZ3ctuE2z-iu_52GGfB7QrQCF8W3mXaYFACWLuJ5U_-2Og6mOxLSFfSiuKCqSzRzM5lvrl1nlVbsOVXURAYlWyiBGuXqD12M8qhaBYgW2vl2nqHl4-YNniAA5Dfry1MRP2J8f_-ObSggMhTglV904CrbRv23bjZtt6o3864Txw77mOhrZbs4HWk-dvmn3M8_E9du4sa6DdbPtnmu5AfR_gq-9_a3AtBgRvJmpSsHvLzOAQ0DO8',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDbc36un5sOXUK5ffAy5ujIhPmvKvAZ3ctuE2z-iu_52GGfB7QrQCF8W3mXaYFACWLuJ5U_-2Og6mOxLSFfSiuKCqSzRzM5lvrl1nlVbsOVXURAYlWyiBGuXqD12M8qhaBYgW2vl2nqHl4-YNniAA5Dfry1MRP2J8f_-ObSggMhTglV904CrbRv23bjZtt6o3864Txw77mOhrZbs4HWk-dvmn3M8_E9du4sa6DdbPtnmu5AfR_gq-9_a3AtBgRvJmpSsHvLzOAQ0DO8',
    ],
    price: 529900,
    stock: 10,
    category: 'fashion',
    rating: 4.6,
    createdAt: '2026-02-28T10:00:00.000Z',
    updatedAt: '2026-02-28T10:00:00.000Z',
  },
  {
    id: '6ba7b813-9dad-11d1-80b4-00c04fd430c8',
    name: 'Nike Revolution 6 Next Nature',
    description:
      'Nike Revolution 6 Next Nature — zapatillas cotidianas confeccionadas con al menos un 20% de materiales reciclados. Parte superior de malla suave, suela de goma duradera y amortiguación de espuma ligera.',
    imgUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD_VL7cOos8bpYTln1ExF-gztKF_WUeGx75lmXMqMbji5gCV7Lz6uxEcIpSFgvfIjY1t3VYoC4ZRte4pbT9_I_Id5TUUvJb-HolHUKK4qZ3XR6kzDN2NBfYbMNzBSC60t6ABMZEY7d1ElsGXkRigYQsnAl5XIIPwjqOPgsl97ogYZD6az7Iu85TH_ARc-Wj2TGkr_wsl6i9PHxv4WWuW-e52fKc4agX_iwhcRH4XoLWhg7fsTbErSFxnsnjTwnNDpICXe1o4Vp7LGb5',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD_VL7cOos8bpYTln1ExF-gztKF_WUeGx75lmXMqMbji5gCV7Lz6uxEcIpSFgvfIjY1t3VYoC4ZRte4pbT9_I_Id5TUUvJb-HolHUKK4qZ3XR6kzDN2NBfYbMNzBSC60t6ABMZEY7d1ElsGXkRigYQsnAl5XIIPwjqOPgsl97ogYZD6az7Iu85TH_ARc-Wj2TGkr_wsl6i9PHxv4WWuW-e52fKc4agX_iwhcRH4XoLWhg7fsTbErSFxnsnjTwnNDpICXe1o4Vp7LGb5',
    ],
    price: 144950,
    stock: 45,
    category: 'fashion',
    rating: 4.3,
    createdAt: '2026-02-28T10:00:00.000Z',
    updatedAt: '2026-02-28T10:00:00.000Z',
  },
  {
    id: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
    name: 'iPhone 14 Pro Max 256GB',
    description:
      'Apple iPhone 14 Pro Max 256GB — el iPhone más avanzado con chip A16 Bionic, pantalla Super Retina XDR ProMotion de 6.7 pulgadas, sistema de triple cámara pro de 48MP, Dynamic Island y modo Acción.',
    imgUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDbe-UV5Y2lqC5AN9u2atlA_6mJTeWF6UDORQOs-wTm01isTA9dR_iX9FdtXgxwuKNoHlruZO9b1u5F85AyYgMIxZFjf15Q7oCUTp2xTlH78jHZ2BIdDNU9kwuRnqY6ARTqOJhTVuywPwoLAMuNWLWcg0vtf9ST9zXKgzXELTlw1g4_xizzijrAwRRbpXN6MGIRZWMWMm8mi7Ob9vVdrSgbKmPJm1m-mu6Lxdh79buEuYOeTqmOctfLeh9LOutKX1ib_grr3jT8yRxh',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDbe-UV5Y2lqC5AN9u2atlA_6mJTeWF6UDORQOs-wTm01isTA9dR_iX9FdtXgxwuKNoHlruZO9b1u5F85AyYgMIxZFjf15Q7oCUTp2xTlH78jHZ2BIdDNU9kwuRnqY6ARTqOJhTVuywPwoLAMuNWLWcg0vtf9ST9zXKgzXELTlw1g4_xizzijrAwRRbpXN6MGIRZWMWMm8mi7Ob9vVdrSgbKmPJm1m-mu6Lxdh79buEuYOeTqmOctfLeh9LOutKX1ib_grr3jT8yRxh',
    ],
    price: 5899900,
    stock: 8,
    category: 'electronics',
    rating: 4.9,
    createdAt: '2026-02-28T10:00:00.000Z',
    updatedAt: '2026-02-28T10:00:00.000Z',
  },
  {
    id: '6ba7b815-9dad-11d1-80b4-00c04fd430c8',
    name: 'Polaroid Now i-Type Instant Camera',
    description:
      'Polaroid Now i-Type — cámara instantánea analógica con sistema de doble lente y enfoque automático. Produce fotografías Polaroid originales de 3.5×4.2 pulgadas. Compatible con películas i-Type y 600.',
    imgUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCKWAb4BL_Amltq2YUwG7Pn1oBSn-C1_QbFB8YbVwdAXuhsI8zVvfx89D2d-PBFz_C0RL7iaMml4tN328x5hVPGNB3S0Y3XcgkQlpc2LUoo65jXl2NCM8A4EltU0s0DsyvnGnipMTXwhmOTt7xzXnsKHGOmaA1tTYHMfw4erK8ZvlNVL6C09gfjYipK9tGG7OFv6MPl3O-NZNjSi1eH5t1Z_bJL1IcF82jinKxoLWzjYTpjMdxjGctNyAa60-ymrya2i2Hg9rSJAtMU',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCKWAb4BL_Amltq2YUwG7Pn1oBSn-C1_QbFB8YbVwdAXuhsI8zVvfx89D2d-PBFz_C0RL7iaMml4tN328x5hVPGNB3S0Y3XcgkQlpc2LUoo65jXl2NCM8A4EltU0s0DsyvnGnipMTXwhmOTt7xzXnsKHGOmaA1tTYHMfw4erK8ZvlNVL6C09gfjYipK9tGG7OFv6MPl3O-NZNjSi1eH5t1Z_bJL1IcF82jinKxoLWzjYTpjMdxjGctNyAa60-ymrya2i2Hg9rSJAtMU',
    ],
    price: 629910,
    stock: 20,
    category: 'electronics',
    rating: 4.7,
    createdAt: '2026-02-28T10:00:00.000Z',
    updatedAt: '2026-02-28T10:00:00.000Z',
  },
];
