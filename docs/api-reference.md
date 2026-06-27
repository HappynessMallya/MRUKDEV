# Fanisi Studio API — API Reference

Version: 1.0  
Base URL: `https://fs-backend-tvk8.onrender.com`

Multi-tenant storefront backend. Tenant-scoped routes require the `x-tenant-slug` header; protected routes require a Bearer JWT.

## Auth
- **Bearer JWT** on protected routes (`Authorization: Bearer <token>`)
- **`x-tenant-slug`** header required on tenant-scoped routes

> NOTE: The OpenAPI spec defines request DTOs but NOT response schemas (all responses are prose). Response shapes must be captured from live calls.

## Endpoints

### audit

#### `GET /audit`  
Headers: `x-tenant-slug`
Responses: 200: 


### auth

#### `POST /auth/login`  
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 201: 

#### `GET /auth/profile`  
Headers: `x-tenant-slug`
Responses: 200: 

#### `POST /auth/register`  
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 201: 


### cart

#### `GET /cart`  Get the current user's cart
Headers: `x-tenant-slug`
Responses: 200: 

#### `DELETE /cart`  
Headers: `x-tenant-slug`
Responses: 200: 

#### `POST /cart/items`  Add a variant to the cart
Headers: `x-tenant-slug`
Request body:
```ts
{
  productId: string  // Product ObjectId
  variantId?: string  // Variant id or sku. Optional only for single-variant products.
  quantity: number
}
```
Responses: 201: 

#### `PATCH /cart/items/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 200: 

#### `DELETE /cart/items/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 


### categories

#### `GET /categories`  
Headers: `x-tenant-slug`
Responses: 200: 

#### `POST /categories`  
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 201: 

#### `GET /categories/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 

#### `PATCH /categories/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 200: 

#### `DELETE /categories/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 


### health

#### `GET /health`  
Headers: `x-tenant-slug`
Responses: 200: 


### inquiries

#### `GET /inquiries`  
Query params:
  - `page` (number)
  - `limit` (number)
  - `status` (string)
Headers: `x-tenant-slug`
Responses: 200: 

#### `POST /inquiries`  
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 201: 

#### `GET /inquiries/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 

#### `PATCH /inquiries/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 200: 

#### `DELETE /inquiries/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 


### invoices

#### `GET /invoices`  
Query params:
  - `page` (number)
  - `limit` (number)
  - `status` (string)
  - `userId` (string)
Headers: `x-tenant-slug`
Responses: 200: 

#### `POST /invoices`  
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 201: 

#### `GET /invoices/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 

#### `PATCH /invoices/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 200: 

#### `POST /invoices/{id}/payment`  
Path params: `id`
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 201: 


### layouts

#### `GET /layouts`  Browse active layouts this tenant can apply
Headers: `x-tenant-slug`
Responses: 200: 


### loyalty

#### `GET /loyalty/account`  
Headers: `x-tenant-slug`
Responses: 200: 

#### `GET /loyalty/badges`  
Headers: `x-tenant-slug`
Responses: 200: 

#### `POST /loyalty/badges`  
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 201: 

#### `POST /loyalty/badges/award`  
Headers: `x-tenant-slug`
Responses: 201: 

#### `PATCH /loyalty/badges/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 200: 

#### `GET /loyalty/levels`  
Headers: `x-tenant-slug`
Responses: 200: 

#### `POST /loyalty/levels`  
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 201: 

#### `PATCH /loyalty/levels/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 200: 

#### `DELETE /loyalty/levels/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 

#### `GET /loyalty/my-badges`  
Headers: `x-tenant-slug`
Responses: 200: 

#### `POST /loyalty/points`  
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 201: 

#### `GET /loyalty/transactions`  
Headers: `x-tenant-slug`
Responses: 200: 


### notifications

#### `GET /notifications`  
Headers: `x-tenant-slug`
Responses: 200: 

#### `POST /notifications`  
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 201: 

#### `PATCH /notifications/read-all`  
Headers: `x-tenant-slug`
Responses: 200: 

#### `GET /notifications/unread-count`  
Headers: `x-tenant-slug`
Responses: 200: 

#### `DELETE /notifications/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 

#### `PATCH /notifications/{id}/read`  
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 


### pages

#### `GET /pages`  List all pages with sections + content (storefront render)
Headers: `x-tenant-slug`
Responses: 200: 

#### `POST /pages/apply-layout`  Apply a layout into this tenant
Headers: `x-tenant-slug`
Request body:
```ts
{
  layoutSlug: string  // Active registry Layout slug to apply to this tenant
}
```
Responses: 201: 

#### `GET /pages/{key}`  Get one page by key
Path params: `key`
Headers: `x-tenant-slug`
Responses: 200: 

#### `PATCH /pages/{key}`  Edit page content
Path params: `key`
Headers: `x-tenant-slug`
Request body:
```ts
{
  isPublished?: boolean  // Publish/unpublish the page
  sections?: {
    key: string  // Section instance key to edit
    content?: {
    }  // New content; validated against the section’s snapshotted field contract
    enabled?: boolean  // Toggle an optional section on/off (required sections cannot be disabled)
  }[]  // Marketing pages: section content/toggle edits
  config?: {
  }  // System pages: config edit (validated against the system-page contract)
}
```
Responses: 200: 


### platform

#### `POST /platform/auth/login`  
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 201: 

#### `POST /platform/layouts`  Create a layout
Headers: `x-tenant-slug`
Request body:
```ts
{
  slug: string
  name: string
  description?: string
  thumbnail?: string
  isActive?: boolean
  definition: {
    pages: {
      key: string
      name: string
      class: string  // enum: ['marketing', 'system']
      path?: string
      sortOrder?: number
      sections?: {
        key: string  // Section instance key (unique within the page)
        type: string  // Catalog section type
        required?: boolean  // Tenants cannot disable a required section
        sortOrder?: number
        defaults?: {
        }  // Default content; must satisfy the section type’s field contract
      }[]  // Marketing pages: composed sections
      config?: {
      }  // System pages: light config matching the system-page contract
    }[]
  }
}
```
Responses: 201: 

#### `GET /platform/layouts`  List layouts
Query params:
  - `isActive` (string)
Headers: `x-tenant-slug`
Responses: 200: 

#### `GET /platform/layouts/{id}`  Get a layout
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 

#### `PATCH /platform/layouts/{id}`  Update a layout
Path params: `id`
Headers: `x-tenant-slug`
Request body:
```ts
{
  slug?: string
  name?: string
  description?: string
  thumbnail?: string
  isActive?: boolean
  definition?: {
    pages: {
      key: string
      name: string
      class: string  // enum: ['marketing', 'system']
      path?: string
      sortOrder?: number
      sections?: {
        key: string  // Section instance key (unique within the page)
        type: string  // Catalog section type
        required?: boolean  // Tenants cannot disable a required section
        sortOrder?: number
        defaults?: {
        }  // Default content; must satisfy the section type’s field contract
      }[]  // Marketing pages: composed sections
      config?: {
      }  // System pages: light config matching the system-page contract
    }[]
  }
}
```
Responses: 200: 

#### `DELETE /platform/layouts/{id}`  Delete a layout
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 

#### `GET /platform/section-catalog`  Full catalog: section types + system pages
Headers: `x-tenant-slug`
Responses: 200: 

#### `GET /platform/section-types`  List section types
Headers: `x-tenant-slug`
Responses: 200: 

#### `POST /platform/section-types`  Create a section type (building block)
Headers: `x-tenant-slug`
Request body:
```ts
{
  type: string  // Unique block type id
  name: string
  kind: string  // enum: ['content', 'dataBound', 'global']
  dataSource?: string  // Live data source for dataBound blocks  enum: ['products', 'categories', 'stories']
  fields: {
    key: string
    label: string
    type: string  // enum: ['string', 'text', 'richtext', 'number', 'boolean', 'image', 'url', 'enum', 'localized', 'link', 'object', 'array']
    required?: boolean
    enumValues?: string[]  // Allowed values when type=enum
    fields?: FieldDefDto (recursive)[]  // Child fields when type=object
    item?: any  // Element contract when type=array
    default?: {
    }  // Default value
  }[]  // The block’s field contract
  isActive?: boolean
  sortOrder?: number
}
```
Responses: 201: 

#### `GET /platform/section-types/{id}`  Get a section type
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 

#### `PATCH /platform/section-types/{id}`  Edit a section type contract
Path params: `id`
Headers: `x-tenant-slug`
Request body:
```ts
{
  type?: string  // Unique block type id
  name?: string
  kind?: string  // enum: ['content', 'dataBound', 'global']
  dataSource?: string  // Live data source for dataBound blocks  enum: ['products', 'categories', 'stories']
  fields?: {
    key: string
    label: string
    type: string  // enum: ['string', 'text', 'richtext', 'number', 'boolean', 'image', 'url', 'enum', 'localized', 'link', 'object', 'array']
    required?: boolean
    enumValues?: string[]  // Allowed values when type=enum
    fields?: FieldDefDto (recursive)[]  // Child fields when type=object
    item?: any  // Element contract when type=array
    default?: {
    }  // Default value
  }[]  // The block’s field contract
  isActive?: boolean
  sortOrder?: number
}
```
Responses: 200: 

#### `DELETE /platform/section-types/{id}`  Delete a section type
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 

#### `GET /platform/system-pages`  List system pages
Headers: `x-tenant-slug`
Responses: 200: 

#### `POST /platform/system-pages`  Create a system page config contract
Headers: `x-tenant-slug`
Request body:
```ts
{
  key: string  // Unique system page key
  name: string
  configFields: {
    key: string
    label: string
    type: string  // enum: ['string', 'text', 'richtext', 'number', 'boolean', 'image', 'url', 'enum', 'localized', 'link', 'object', 'array']
    required?: boolean
    enumValues?: string[]  // Allowed values when type=enum
    fields?: FieldDefDto (recursive)[]  // Child fields when type=object
    item?: any  // Element contract when type=array
    default?: {
    }  // Default value
  }[]  // Editable config contract
  isActive?: boolean
  sortOrder?: number
}
```
Responses: 201: 

#### `GET /platform/system-pages/{id}`  Get a system page
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 

#### `PATCH /platform/system-pages/{id}`  Edit a system page config contract
Path params: `id`
Headers: `x-tenant-slug`
Request body:
```ts
{
  key?: string  // Unique system page key
  name?: string
  configFields?: {
    key: string
    label: string
    type: string  // enum: ['string', 'text', 'richtext', 'number', 'boolean', 'image', 'url', 'enum', 'localized', 'link', 'object', 'array']
    required?: boolean
    enumValues?: string[]  // Allowed values when type=enum
    fields?: FieldDefDto (recursive)[]  // Child fields when type=object
    item?: any  // Element contract when type=array
    default?: {
    }  // Default value
  }[]  // Editable config contract
  isActive?: boolean
  sortOrder?: number
}
```
Responses: 200: 

#### `DELETE /platform/system-pages/{id}`  Delete a system page
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 

#### `POST /platform/tenants`  
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 201: 

#### `GET /platform/tenants`  
Headers: `x-tenant-slug`
Responses: 200: 

#### `GET /platform/tenants/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 

#### `PATCH /platform/tenants/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 200: 

#### `DELETE /platform/tenants/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 

#### `PATCH /platform/tenants/{id}/activate`  
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 

#### `POST /platform/tenants/{id}/apply-layout`  
Path params: `id`
Headers: `x-tenant-slug`
Request body:
```ts
{
  layoutSlug: string  // Registry Layout slug to copy into the tenant DB
}
```
Responses: 201: 

#### `PATCH /platform/tenants/{id}/deactivate`  
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 


### products

#### `GET /products`  List products
Query params:
  - `page` (number) [default=1]
  - `limit` (number) [default=20]
  - `categoryId` (string) — Filter by subcategory (leaf) ObjectId
  - `search` (string) — Search product name (en/sw)
  - `isPublished` (boolean)
  - `isFeatured` (boolean)
  - `brand` (string)
  - `inStock` (boolean) — Only products with at least one in-stock variant
Headers: `x-tenant-slug`
Responses: 200: Paginated products with availability + price range

#### `POST /products`  Create a product
Headers: `x-tenant-slug`
Request body:
```ts
{
  categoryId: string  // Subcategory (leaf) ObjectId this product belongs to
  name: {
    en: string  // English text
    sw: string  // Swahili text
  }
  slug: string
  sku: string
  modelNumber?: string
  brand?: string
  description?: {
    en: string  // English text
    sw: string  // Swahili text
  }
  shortDescription?: {
    en: string  // English text
    sw: string  // Swahili text
  }
  currency?: string
  price?: number  // Price for the default variant when the product has no option groups
  salePrice?: number  // Sale price for the default variant
  quantity?: number  // Inventory quantity for the default variant
  isPublished?: boolean
  isFeatured?: boolean
  featuredPriority?: number  // Ordering weight among featured products — higher shows first
  isNewArrival?: boolean
  weight?: string
  dimensions?: string
  warranty?: {
    en: string  // English text
    sw: string  // Swahili text
  }
  loyaltyPointsEarned?: number
  tags?: string[]
  media?: {
    id?: string  // Stable id; generated when omitted
    url: string
    type?: string  // enum: ['image', 'video']
    altText?: string
    isPrimary?: boolean
    sortOrder?: number
  }[]  // Images and video (up to 10)
  options?: {
    id?: string
    name: string  // Variant axis name
    values: string[]  // Allowed values for this axis
    sortOrder?: number
  }[]  // Variant axes; omit for a single-variant product
  variants?: {
    id?: string
    title?: string  // Display title; derived from options when omitted
    sku?: string
    options?: {
      name: string  // Must match a declared option name
      value: string  // Must be one of that option’s values
    }[]  // Option values this variant resolves to; empty for the default variant
    price?: number  // Absolute price; null/omitted = quote-only (priced in the proforma)
    salePrice?: number
    stock?: number
    isInStock?: boolean  // Availability override; when set it wins over the stock count
    imageUrl?: string
    isActive?: boolean
    sortOrder?: number
  }[]  // Explicit variants; a default variant is synthesized when omitted
  characteristics?: {
    id?: string
    icon?: string  // PNG icon url
    title: any
    sortOrder?: number
  }[]
  highlights?: {
    id?: string
    text: any
    sortOrder?: number
  }[]
  specs?: {
    id?: string
    name: any
    value: string
    sortOrder?: number
  }[]
  documents?: {
    id?: string
    url: string
    name?: string
    sortOrder?: number
  }[]  // PDF manuals & downloads
}
```
Responses: 201: The created product with its variants

#### `GET /products/slug/{slug}`  Get a product by slug
Path params: `slug`
Headers: `x-tenant-slug`
Responses: 200: 

#### `GET /products/{id}`  Get a product by id
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 

#### `PATCH /products/{id}`  Update a product
Path params: `id`
Headers: `x-tenant-slug`
Request body:
```ts
{
  categoryId?: string  // Subcategory (leaf) ObjectId this product belongs to
  name?: {
    en: string  // English text
    sw: string  // Swahili text
  }
  slug?: string
  sku?: string
  modelNumber?: string
  brand?: string
  description?: {
    en: string  // English text
    sw: string  // Swahili text
  }
  shortDescription?: {
    en: string  // English text
    sw: string  // Swahili text
  }
  currency?: string
  price?: number  // Price for the default variant when the product has no option groups
  salePrice?: number  // Sale price for the default variant
  quantity?: number  // Inventory quantity for the default variant
  isPublished?: boolean
  isFeatured?: boolean
  featuredPriority?: number  // Ordering weight among featured products — higher shows first
  isNewArrival?: boolean
  weight?: string
  dimensions?: string
  warranty?: {
    en: string  // English text
    sw: string  // Swahili text
  }
  loyaltyPointsEarned?: number
  tags?: string[]
  media?: {
    id?: string  // Stable id; generated when omitted
    url: string
    type?: string  // enum: ['image', 'video']
    altText?: string
    isPrimary?: boolean
    sortOrder?: number
  }[]  // Images and video (up to 10)
  options?: {
    id?: string
    name: string  // Variant axis name
    values: string[]  // Allowed values for this axis
    sortOrder?: number
  }[]  // Variant axes; omit for a single-variant product
  variants?: {
    id?: string
    title?: string  // Display title; derived from options when omitted
    sku?: string
    options?: {
      name: string  // Must match a declared option name
      value: string  // Must be one of that option’s values
    }[]  // Option values this variant resolves to; empty for the default variant
    price?: number  // Absolute price; null/omitted = quote-only (priced in the proforma)
    salePrice?: number
    stock?: number
    isInStock?: boolean  // Availability override; when set it wins over the stock count
    imageUrl?: string
    isActive?: boolean
    sortOrder?: number
  }[]  // Explicit variants; a default variant is synthesized when omitted
  characteristics?: {
    id?: string
    icon?: string  // PNG icon url
    title: any
    sortOrder?: number
  }[]
  highlights?: {
    id?: string
    text: any
    sortOrder?: number
  }[]
  specs?: {
    id?: string
    name: any
    value: string
    sortOrder?: number
  }[]
  documents?: {
    id?: string
    url: string
    name?: string
    sortOrder?: number
  }[]  // PDF manuals & downloads
}
```
Responses: 200: 

#### `DELETE /products/{id}`  Delete a product
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 


### proformas

#### `GET /proformas`  
Query params:
  - `page` (number)
  - `limit` (number)
  - `status` (string)
  - `userId` (string)
Headers: `x-tenant-slug`
Responses: 200: 

#### `POST /proformas`  
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 201: 

#### `GET /proformas/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 

#### `PATCH /proformas/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 200: 

#### `POST /proformas/{id}/convert`  
Path params: `id`
Headers: `x-tenant-slug`
Responses: 201: 


### roles

#### `GET /roles`  
Headers: `x-tenant-slug`
Responses: 200: 

#### `POST /roles`  
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 201: 

#### `GET /roles/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 

#### `PATCH /roles/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 200: 

#### `DELETE /roles/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 


### root

#### `GET /`  
Headers: `x-tenant-slug`
Responses: 200: 


### section-catalog

#### `GET /section-catalog`  List section types + system pages (tenant editor)
Headers: `x-tenant-slug`
Responses: 200: 


### service-locations

#### `GET /service-locations`  
Headers: `x-tenant-slug`
Responses: 200: 

#### `POST /service-locations`  
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 201: 

#### `GET /service-locations/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 

#### `PATCH /service-locations/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 200: 

#### `DELETE /service-locations/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 


### site-config

#### `GET /site-config`  
Headers: `x-tenant-slug`
Responses: 200: 

#### `POST /site-config`  
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 201: 

#### `PATCH /site-config`  
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 200: 


### tenant

#### `GET /tenant/context`  
Headers: `x-tenant-slug`
Responses: 200: 

#### `GET /tenant/products`  
Headers: `x-tenant-slug`
Responses: 200: 


### users

#### `GET /users`  
Headers: `x-tenant-slug`
Responses: 200: 

#### `POST /users`  
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 201: 

#### `GET /users/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 

#### `PATCH /users/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Request body:
```ts
{
}
```
Responses: 200: 

#### `DELETE /users/{id}`  
Path params: `id`
Headers: `x-tenant-slug`
Responses: 200: 

