import { ArrowRight, MessageCircle } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  imageUrl?: string;
  packaging?: string;
  moq?: string;
  published: boolean;
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  if (!product.published) {
    return null;
  }

  const whatsappMessage = encodeURIComponent(
    `Hello KUNASHA CHEMICALS, I am interested in ${product.name}. Please share details and quotation.`
  );

  const whatsappUrl = `https://wa.me/YOUR_WHATSAPP_NUMBER?text=${whatsappMessage}`;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Product Image */}
      <a
        href={`/products/${product.slug}`}
        className="block overflow-hidden bg-slate-100"
      >
        <div className="flex h-56 items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-700 text-2xl font-black text-white">
              KC
            </div>
          )}
        </div>
      </a>

      {/* Product Content */}
      <div className="p-6">
        <div className="text-xs font-bold uppercase tracking-wider text-blue-700">
          {product.category}
        </div>

        <a href={`/products/${product.slug}`}>
          <h3 className="mt-2 text-xl font-bold text-slate-900 transition group-hover:text-blue-700">
            {product.name}
          </h3>
        </a>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
          {product.shortDescription}
        </p>

        {/* Product Info */}
        {(product.packaging || product.moq) && (
          <div className="mt-5 grid grid-cols-2 gap-3">
            {product.packaging && (
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-xs text-slate-400">Packaging</div>
                <div className="mt-1 text-sm font-semibold text-slate-700">
                  {product.packaging}
                </div>
              </div>
            )}

            {product.moq && (
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-xs text-slate-400">MOQ</div>
                <div className="mt-1 text-sm font-semibold text-slate-700">
                  {product.moq}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <a
            href={`/products/${product.slug}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-600 hover:text-blue-700"
          >
            View Details
            <ArrowRight size={16} />
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-xl bg-green-600 px-4 py-3 text-white transition hover:bg-green-700"
            aria-label={`Enquire about ${product.name} on WhatsApp`}
          >
            <MessageCircle size={19} />
          </a>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;