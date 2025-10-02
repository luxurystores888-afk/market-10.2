// Errors
const errors = {
  en: { required: 'Field required' },
  ar: { required: 'الحقل مطلوب' }
};

// Product schema
const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive()
});
