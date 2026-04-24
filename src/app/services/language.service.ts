import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Translations {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguage = new BehaviorSubject<'ar' | 'en'>('ar');
  currentLanguage$ = this.currentLanguage.asObservable();

  private translations: { [key: string]: Translations } = {
    ar: {
      // Navbar
      'nav.home': 'الرئيسية',
      'nav.products': 'المنتجات',
      'nav.categories': 'الأقسام',
      'nav.deals': 'العروض',
      'nav.about': 'نبذة عنا',
      'nav.search': 'بحث',
      'nav.wishlist': 'المفضلة',
      'nav.cart': 'السلة',
      
      // Footer
      'footer.about': 'عن المتجر',
      'footer.contact': 'اتصل بنا',
      'footer.privacy': 'سياسة الخصوصية',
      'footer.terms': 'الشروط والأحكام',
      'footer.rights': 'جميع الحقوق محفوظة',
      'footer.admin': 'أدمن',
      'theme.dark': 'الوضع الداكن',
      'theme.light': 'الوضع الفاتح',
      
      // Admin
      'admin.dashboard': 'لوحة التحكم',
      'admin.employees': 'الموظفين',
      'admin.site': 'الموقع',
      'admin.shipping': 'الشحن',
      'admin.products': 'المنتجات',
      'admin.accounts': 'الحسابات',
      'admin.logout': 'تسجيل الخروج',
      'admin.back': 'رجوع',
      'admin.totalProducts': 'إجمالي المنتجات',
      'admin.totalOrders': 'إجمالي الطلبات',
      'admin.totalRevenue': 'إجمالي الإيرادات',
      'admin.shippingCompanies': 'شركات الشحن',
      'admin.addShippingCompany': 'إضافة شركة شحن',
      'admin.shippingCompany': 'شركة الشحن',
      'admin.shippingCompanyName': 'اسم شركة الشحن',
      'admin.shippingCompanyLogo': 'شعار شركة الشحن',
      'admin.currency': 'العملة',
      'admin.governorates': 'المحافظات',
      'admin.countries': 'دول',
      'admin.edit': 'تعديل',
      'admin.delete': 'حذف',
      'admin.recentOrders': 'الطلبات الأخيرة',
      'admin.noOrders': 'لا توجد طلبات',
      
      // Admin Site Management
      'admin.siteInfo': 'معلومات الموقع',
      'admin.siteName': 'اسم الموقع',
      'admin.siteLogo': 'شعار الموقع',
      'admin.promoBanner': 'بانر العروض',
      'admin.bannerText': 'نص البانر',
      'admin.bannerLink': 'رابط البانر',
      'admin.bannerImage': 'صورة البانر',
      'admin.backgroundImages': 'صور الخلفية',
      'admin.homeBackground': 'خلفية الصفحة الرئيسية',
      'admin.categoryBackground': 'خلفية الأقسام',
      'admin.saveChanges': 'حفظ التغييرات',
      
      // Admin Products
      'admin.productsTitle': 'المنتجات',
      'admin.categoriesTitle': 'الأقسام',
      'admin.addProduct': 'إضافة منتج',
      'admin.addCategory': 'إضافة قسم',
      'admin.productName': 'اسم المنتج',
      'admin.price': 'السعر',
      'admin.defaultPrice': 'السعر الافتراضي',
      'admin.pricesByCountry': 'الأسعار حسب الدولة',
      'admin.egyptPrice': 'سعر مصر',
      'admin.saudiPrice': 'سعر السعودية',
      'admin.omanPrice': 'سعر عمان',
      'admin.description': 'الوصف',
      'admin.image': 'الصورة',
      'admin.category': 'القسم',
      'admin.stock': 'المخزون',
      'admin.actions': 'الإجراءات',
      'admin.cancel': 'إلغاء',
      'admin.update': 'تحديث',
      'admin.add': 'إضافة',
      
      // About Us
      'about.title': 'نبذة عنا',
      'about.subtitle': 'نحن هنا لنقدم لك أفضل تجربة تسوق أونلاين مع منتجات عالية الجودة وخدمة عملاء ممتازة',
      'about.visitors': 'زيارة الموقع',
      'about.orders': 'طلب مكتمل',
      'about.customers': 'عميل سعيد',
      'about.rating': 'تقييم العملاء',
      'about.ourStory': 'قصتنا',
      'about.story1': 'بدأنا رحلتنا في عام 2020 بهدف بسيط: تقديم منتجات عالية الجودة بأسعار مناسبة للعملاء في كل مكان.',
      'about.story2': 'نحن نؤمن بأن التسوق يجب أن يكون سهلاً وممتعاً. لهذا السبب قمنا ببناء منصة تجمع بين الجودة والسعر والخدمة المتميزة.',
      'about.story3': 'اليوم، نحن فخورون بخدمة أكثر من 100,000 عميل حول العالم، ونستمر في النمو والتحسن يومياً.',
      'about.fastDelivery': 'توصيل سريع',
      'about.fastDeliveryDesc': 'توصيل سريع وموثوق لجميع طلباتك',
      'about.securePayment': 'دفع آمن',
      'about.securePaymentDesc': 'طرق دفع آمنة ومحمية 100%',
      'about.qualityProducts': 'منتجات عالية الجودة',
      'about.qualityProductsDesc': 'منتجات أصلية من أفضل العلامات التجارية',
      'about.support247': 'دعم على مدار الساعة',
      'about.support247Desc': 'فريق دعم متاح 24/7 لمساعدتك',
      'about.testimonials': 'آراء العملاء',
      'about.readyToShop': 'جاهز للتسوق؟',
      'about.readyToShopDesc': 'ابدأ رحلة التسوق الخاصة بك الآن واستمتع بأفضل العروض',
      'about.startShopping': 'ابدأ التسوق',
      
      // Login
      'login.title': 'تسجيل الدخول',
      'login.subtitle': 'سجل دخولك للوصول إلى حسابك',
      'login.email': 'البريد الإلكتروني',
      'login.emailPlaceholder': 'أدخل بريدك الإلكتروني',
      'login.password': 'كلمة المرور',
      'login.passwordPlaceholder': 'أدخل كلمة المرور',
      'login.rememberMe': 'تذكرني',
      'login.signIn': 'تسجيل الدخول',
      'login.noAccount': 'ليس لديك حساب؟',
      'login.signUp': 'إنشاء حساب',
      'login.invalidCredentials': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      
      // Register
      'register.title': 'إنشاء حساب جديد',
      'register.subtitle': 'انضم إلينا واستمتع بتجربة تسوق ممتازة',
      'register.name': 'الاسم',
      'register.namePlaceholder': 'أدخل اسمك',
      'register.email': 'البريد الإلكتروني',
      'register.emailPlaceholder': 'أدخل بريدك الإلكتروني',
      'register.password': 'كلمة المرور',
      'register.passwordPlaceholder': 'أدخل كلمة المرور',
      'register.confirmPassword': 'تأكيد كلمة المرور',
      'register.confirmPasswordPlaceholder': 'أعد إدخال كلمة المرور',
      'register.agreeTerms': 'أوافق على',
      'register.termsOfService': 'الشروط والأحكام',
      'register.createAccount': 'إنشاء حساب',
      'register.hasAccount': 'لديك حساب بالفعل؟',
      'register.signIn': 'تسجيل الدخول',
      'register.passwordsNotMatch': 'كلمات المرور غير متطابقة',
      'register.fillAllFields': 'يرجى ملء جميع الحقول',
      
      // Admin Employees
      'login.button': 'تسجيل الدخول',
      'login.invalid': 'البريد أو كلمة المرور غير صحيحة',
      'login.success': 'تم تسجيل الدخول بنجاح!',
      
      // Categories
      'category.electronics': 'الإلكترونيات',
      'category.clothing': 'الملابس',
      'category.accessories': 'الإكسسوارات',
      
      // Home
      'home.newCollection': 'مجموعة جديدة',
      'home.heroTitle': 'اكتشف',
      'home.heroSubtitle': 'تسوق أحدث المنتجات بأفضل الأسعار. توصيل سريع إلى جميع أنحاء العالم.',
      'home.shopNow': 'تسوق الآن',
      'home.viewDeals': 'عرض العروض',
      'home.searchPlaceholder': 'ابحث عن منتجات...',
      'home.allCategories': 'جميع الأقسام',
      'home.all': 'الكل',
      'home.loading': 'جاري التحميل...',
      'home.noProducts': 'لم يتم العثور على منتجات',
      'home.addToCart': 'أضف للسلة',
      'home.addedToCart': 'تمت الإضافة للسلة',
      'home.price': 'السعر',
      'home.viewAllProducts': 'عرض جميع المنتجات',

      // Products
      'products.title': 'جميع المنتجات',
      'products.subtitle': 'اكتشف مجموعتنا الكاملة من المنتجات المميزة',
      'products.sortBy': 'ترتيب حسب',
      'products.priceLow': 'السعر: من الأقل للأعلى',
      'products.priceHigh': 'السعر: من الأعلى للأقل',
      'products.name': 'الاسم',

      // Deals
      'deals.limitedOffer': 'عرض محدود',
      'deals.upToDiscount': 'خصم يصل إلى 50%',
      'deals.subtitle': 'لا تفوت أكبر بيع لدينا هذا العام!',
      'deals.shopAllDeals': 'تسوق جميع العروض',
      'deals.hotDeals': 'عروض ساخنة',
      'deals.flashSaleEnds': 'ينتهي البيع السريع خلال',
      'deals.hours': 'ساعات',
      'deals.minutes': 'دقائق',
      'deals.seconds': 'ثواني',
      
      // Cart
      'cart.title': 'سلة التسوق',
      'cart.empty': 'سلتك فارغة',
      'cart.emptyMessage': 'يبدو أنك لم تضف أي منتجات بعد',
      'cart.startShopping': 'ابدأ التسوق',
      'cart.continueShopping': 'متابعة التسوق',
      'cart.checkout': 'إتمام الطلب',
      'cart.remove': 'إزالة',
      'cart.quantity': 'الكمية',
      'cart.subtotal': 'المجموع الفرعي',
      'cart.total': 'الإجمالي',
      
      // Checkout
      'checkout.title': 'إتمام الطلب',
      'checkout.backToCart': 'العودة للسلة',
      'checkout.customerInfo': 'معلومات العميل',
      'checkout.fullName': 'الاسم الكامل',
      'checkout.emailAddress': 'البريد الإلكتروني',
      'checkout.addressInfo': 'معلومات العنوان',
      'checkout.country': 'الدولة',
      'checkout.selectCountry': 'اختر الدولة',
      'checkout.governorate': 'المحافظة',
      'checkout.selectGovernorate': 'اختر المحافظة',
      'checkout.area': 'المنطقة',
      'checkout.streetName': 'اسم الشارع',
      'checkout.buildingNumber': 'رقم المبنى',
      'checkout.floor': 'الطابق',
      'checkout.apartmentNumber': 'رقم الشقة',
      'checkout.paymentMethod': 'طريقة الدفع',
      'checkout.cashOnDelivery': 'الدفع عند الاستلام',
      'checkout.cashOnDeliveryDesc': 'ادفع عند استلام الطلب',
      'checkout.paypal': 'بايبال',
      'checkout.paypalDesc': 'ادفع بأمان باستخدام PayPal',
      'checkout.stripe': 'بطاقة ائتمان',
      'checkout.stripeDesc': 'ادفع باستخدام بطاقة الائتمان',
      'checkout.pay': 'ادفع',
      'checkout.processing': 'جاري معالجة الدفع...',
      'checkout.orderSummary': 'ملخص الطلب',
      'checkout.subtotal': 'المجموع الفرعي',
      'checkout.shipping': 'الشحن',
      'checkout.free': 'مجاني',
      'checkout.tax': 'الضريبة (10%)',
      'checkout.total': 'الإجمالي',
      'checkout.securePayment': 'دفع آمن مدعوم بتشفير معياري في الصناعة',
      
      // Product Details
      'product.addToCart': 'أضف للسلة',
      'product.buyNow': 'اشتري الآن',
      'product.description': 'الوصف',
      'product.specifications': 'المواصفات',
      'product.reviews': 'التقييمات',
      'product.inStock': 'متوفر',
      'product.outOfStock': 'غير متوفر',
      'product.quantity': 'الكمية',
    },
    en: {
      // Navbar
      'nav.home': 'Home',
      'nav.products': 'Products',
      'nav.categories': 'Categories',
      'nav.deals': 'Deals',
      'nav.about': 'About Us',
      'nav.search': 'Search',
      'nav.wishlist': 'Wishlist',
      'nav.cart': 'Cart',
      
      // Footer
      'footer.about': 'About',
      'footer.contact': 'Contact',
      'footer.privacy': 'Privacy Policy',
      'footer.terms': 'Terms of Service',
      'footer.rights': 'All rights reserved',
      'footer.admin': 'Admin',
      'theme.dark': 'Dark Mode',
      'theme.light': 'Light Mode',
      
      // Admin
      'admin.dashboard': 'Dashboard',
      'admin.employees': 'Employees',
      'admin.site': 'Site Management',
      'admin.shipping': 'Shipping',
      'admin.products': 'Products & Categories',
      'admin.accounts': 'Accounts',
      'admin.logout': 'Logout',
      'admin.back': 'Back to Store',
      'admin.totalProducts': 'Total Products',
      'admin.totalOrders': 'Total Orders',
      'admin.totalRevenue': 'Total Revenue',
      'admin.shippingCompanies': 'Shipping Companies',
      'admin.addShippingCompany': 'Add Shipping Company',
      'admin.shippingCompany': 'Shipping Company',
      'admin.shippingCompanyName': 'Shipping Company Name',
      'admin.shippingCompanyLogo': 'Shipping Company Logo',
      'admin.currency': 'Currency',
      'admin.governorates': 'Governorates',
      'admin.countries': 'Countries',
      'admin.edit': 'Edit',
      'admin.delete': 'Delete',
      'admin.recentOrders': 'Recent Orders',
      'admin.noOrders': 'No orders yet',
      
      // Admin Site Management
      'admin.siteInfo': 'Site Information',
      'admin.siteName': 'Site Name',
      'admin.siteLogo': 'Site Logo',
      'admin.promoBanner': 'Promo Banner',
      'admin.bannerText': 'Banner Text',
      'admin.bannerLink': 'Banner Link',
      'admin.bannerImage': 'Banner Image',
      'admin.backgroundImages': 'Background Images',
      'admin.homeBackground': 'Home Background',
      'admin.categoryBackground': 'Category Background',
      'admin.saveChanges': 'Save Changes',
      
      // Admin Products
      'admin.productsTitle': 'Products',
      'admin.categoriesTitle': 'Categories',
      'admin.addProduct': 'Add Product',
      'admin.addCategory': 'Add Category',
      'admin.productName': 'Product Name',
      'admin.price': 'Price',
      'admin.defaultPrice': 'Default Price',
      'admin.pricesByCountry': 'Prices by Country',
      'admin.egyptPrice': 'Egypt Price',
      'admin.saudiPrice': 'Saudi Price',
      'admin.omanPrice': 'Oman Price',
      'admin.description': 'Description',
      'admin.image': 'Image',
      'admin.category': 'Category',
      'admin.stock': 'Stock',
      'admin.actions': 'Actions',
      'admin.cancel': 'Cancel',
      'admin.update': 'Update',
      'admin.add': 'Add',
      
      // About Us
      'about.title': 'About Us',
      'about.subtitle': 'We are here to provide you with the best online shopping experience with high-quality products and excellent customer service',
      'about.visitors': 'Site Visitors',
      'about.orders': 'Completed Orders',
      'about.customers': 'Happy Customers',
      'about.rating': 'Customer Rating',
      'about.ourStory': 'Our Story',
      'about.story1': 'We started our journey in 2020 with a simple goal: to provide high-quality products at affordable prices to customers everywhere.',
      'about.story2': 'We believe that shopping should be easy and enjoyable. That is why we built a platform that combines quality, price, and exceptional service.',
      'about.story3': 'Today, we are proud to serve over 100,000 customers worldwide, and we continue to grow and improve every day.',
      'about.fastDelivery': 'Fast Delivery',
      'about.fastDeliveryDesc': 'Fast and reliable delivery for all your orders',
      'about.securePayment': 'Secure Payment',
      'about.securePaymentDesc': '100% secure and protected payment methods',
      'about.qualityProducts': 'High Quality Products',
      'about.qualityProductsDesc': 'Authentic products from the best brands',
      'about.support247': '24/7 Support',
      'about.support247Desc': 'Support team available 24/7 to help you',
      'about.testimonials': 'Customer Reviews',
      'about.readyToShop': 'Ready to Shop?',
      'about.readyToShopDesc': 'Start your shopping journey now and enjoy the best offers',
      'about.startShopping': 'Start Shopping',
      
      // Login
      'login.title': 'Sign In',
      'login.subtitle': 'Sign in to access your account',
      'login.email': 'Email',
      'login.emailPlaceholder': 'Enter your email',
      'login.password': 'Password',
      'login.passwordPlaceholder': 'Enter your password',
      'login.rememberMe': 'Remember me',
      'login.signIn': 'Sign In',
      'login.noAccount': "Don't have an account?",
      'login.signUp': 'Sign Up',
      'login.invalidCredentials': 'Invalid email or password',
      
      // Register
      'register.title': 'Create Account',
      'register.subtitle': 'Join us and enjoy an excellent shopping experience',
      'register.name': 'Name',
      'register.namePlaceholder': 'Enter your name',
      'register.email': 'Email',
      'register.emailPlaceholder': 'Enter your email',
      'register.password': 'Password',
      'register.passwordPlaceholder': 'Enter your password',
      'register.confirmPassword': 'Confirm Password',
      'register.confirmPasswordPlaceholder': 'Re-enter your password',
      'register.agreeTerms': 'I agree to the',
      'register.termsOfService': 'Terms of Service',
      'register.createAccount': 'Create Account',
      'register.hasAccount': 'Already have an account?',
      'register.signIn': 'Sign In',
      'register.passwordsNotMatch': 'Passwords do not match',
      'register.fillAllFields': 'Please fill all fields',
      
      // Admin Employees
      'login.button': 'Login',
      'login.invalid': 'Invalid email or password',
      'login.success': 'Admin login successful!',
      
      // Categories
      'category.electronics': 'Electronics',
      'category.clothing': 'Clothing',
      'category.accessories': 'Accessories',
      
      // Home
      'home.newCollection': 'New Collection 2024',
      'home.heroTitle': 'Discover Luxury',
      'home.heroSubtitle': 'Experience the finest collection of premium products curated for the discerning shopper. From cutting-edge electronics to timeless fashion, discover excellence in every detail.',
      'home.shopNow': 'Shop Now',
      'home.viewDeals': 'View Deals',
      'home.searchPlaceholder': 'Search products...',
      'home.allCategories': 'All Categories',
      'home.all': 'All',
      'home.loading': 'Loading products...',
      'home.noProducts': 'No products found',
      'home.viewAllProducts': 'View All Products',
      'home.addToCart': 'Add to Cart',
      'home.price': 'Price',

      // Products
      'products.title': 'All Products',
      'products.subtitle': 'Discover our complete collection of premium products',
      'products.sortBy': 'Sort by',
      'products.priceLow': 'Price: Low to High',
      'products.priceHigh': 'Price: High to Low',
      'products.name': 'Name',

      // Deals
      'deals.limitedOffer': 'LIMITED TIME OFFER',
      'deals.upToDiscount': 'Up to 50% OFF',
      'deals.subtitle': "Don't miss out on our biggest sale of the year!",
      'deals.shopAllDeals': 'Shop All Deals',
      'deals.hotDeals': 'Hot Deals',
      'deals.flashSaleEnds': 'Flash Sale Ends In',
      'deals.hours': 'Hours',
      'deals.minutes': 'Minutes',
      'deals.seconds': 'Seconds',
      
      // Cart
      'cart.title': 'Shopping Cart',
      'cart.empty': 'Your cart is empty',
      'cart.emptyMessage': 'Looks like you haven\'t added any items yet',
      'cart.startShopping': 'Start Shopping',
      'cart.continueShopping': 'Continue Shopping',
      'cart.checkout': 'Checkout',
      'cart.remove': 'Remove',
      'cart.quantity': 'Quantity',
      'cart.subtotal': 'Subtotal',
      'cart.total': 'Total',
      
      // Checkout
      'checkout.title': 'Checkout',
      'checkout.backToCart': 'Back to Cart',
      'checkout.customerInfo': 'Customer Information',
      'checkout.fullName': 'Full Name',
      'checkout.emailAddress': 'Email Address',
      'checkout.addressInfo': 'Address Information',
      'checkout.country': 'Country',
      'checkout.selectCountry': 'Select Country',
      'checkout.governorate': 'Governorate',
      'checkout.selectGovernorate': 'Select Governorate',
      'checkout.area': 'Area',
      'checkout.streetName': 'Street Name',
      'checkout.buildingNumber': 'Building Number',
      'checkout.floor': 'Floor',
      'checkout.apartmentNumber': 'Apartment Number',
      'checkout.paymentMethod': 'Payment Method',
      'checkout.cashOnDelivery': 'Cash on Delivery',
      'checkout.cashOnDeliveryDesc': 'Pay when your order arrives',
      'checkout.paypal': 'PayPal',
      'checkout.paypalDesc': 'Pay with your PayPal account',
      'checkout.creditCard': 'Credit Card',
      'checkout.creditCardDesc': 'Pay with your credit card',
      'checkout.pay': 'Pay',
      'checkout.processing': 'Processing Payment...',
      'checkout.orderSummary': 'Order Summary',
      'checkout.subtotal': 'Subtotal',
      'checkout.shipping': 'Shipping',
      'checkout.free': 'Free',
      'checkout.tax': 'Tax (10%)',
      'checkout.total': 'Total',
      'checkout.securePayment': 'Secure payment powered by industry-standard encryption',
      
      // Product Details
      'product.addToCart': 'Add to Cart',
      'product.buyNow': 'Buy Now',
      'product.description': 'Description',
      'product.specifications': 'Specifications',
      'product.reviews': 'Reviews',
      'product.inStock': 'In Stock',
      'product.outOfStock': 'Out of Stock',
      'product.quantity': 'Quantity',
    }
  };

  constructor() {
    // Load saved language from localStorage
    const savedLang = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLang) {
      this.currentLanguage.next(savedLang);
    }
  }

  setLanguage(lang: 'ar' | 'en'): void {
    this.currentLanguage.next(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  getLanguage(): 'ar' | 'en' {
    return this.currentLanguage.value;
  }

  translate(key: string): string {
    const lang = this.currentLanguage.value;
    return this.translations[lang][key] || key;
  }
}
