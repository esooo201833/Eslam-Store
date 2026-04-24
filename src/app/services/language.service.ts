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
      
      // Admin
      'admin.dashboard': 'لوحة التحكم',
      'admin.employees': 'الموظفين',
      'admin.site': 'إدارة الموقع',
      'admin.products': 'المنتجات والأقسام',
      'admin.accounts': 'الحسابات',
      'admin.logout': 'تسجيل الخروج',
      'admin.back': 'العودة للمتجر',
      
      // Admin Dashboard
      'admin.totalProducts': 'إجمالي المنتجات',
      'admin.totalOrders': 'إجمالي الطلبات',
      'admin.totalRevenue': 'إجمالي الإيرادات',
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
      'admin.description': 'الوصف',
      'admin.image': 'الصورة',
      'admin.category': 'القسم',
      'admin.stock': 'المخزون',
      'admin.actions': 'الإجراءات',
      'admin.edit': 'تعديل',
      'admin.delete': 'حذف',
      'admin.cancel': 'إلغاء',
      'admin.update': 'تحديث',
      'admin.add': 'إضافة',
      
      // Admin Employees
      'admin.employeesTitle': 'إدارة الموظفين',
      'admin.addEmployee': 'إضافة موظف',
      'admin.name': 'الاسم',
      'admin.email': 'البريد الإلكتروني',
      'admin.password': 'كلمة المرور',
      'admin.role': 'الدور',
      'admin.permissions': 'الصلاحيات',
      'admin.manageProducts': 'إدارة المنتجات',
      'admin.manageCategories': 'إدارة الأقسام',
      'admin.manageOrders': 'إدارة الطلبات',
      'admin.manageSite': 'إدارة الموقع',
      
      // Admin Accounts
      'admin.accountsTitle': 'حسابات الأدمن',
      'admin.superAdmin': 'الأدمن الرئيسي',
      'admin.fullAccess': 'صلاحيات كاملة',
      
      // General
      'general.orEnterUrl': 'أو أدخل رابط الصورة',
      'general.enter': 'أدخل',
      'general.select': 'اختر',
      'general.selectCategory': 'اختر القسم',
      
      // Login
      'login.title': 'تسجيل دخول الأدمن',
      'login.email': 'البريد الإلكتروني',
      'login.password': 'كلمة المرور',
      'login.button': 'تسجيل الدخول',
      'login.invalid': 'البريد أو كلمة المرور غير صحيحة',
      'login.success': 'تم تسجيل الدخول بنجاح!',
    },
    en: {
      // Navbar
      'nav.home': 'Home',
      'nav.products': 'Products',
      'nav.categories': 'Categories',
      'nav.deals': 'Deals',
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
      
      // Admin
      'admin.dashboard': 'Dashboard',
      'admin.employees': 'Employees',
      'admin.site': 'Site Management',
      'admin.products': 'Products & Categories',
      'admin.accounts': 'Accounts',
      'admin.logout': 'Logout',
      'admin.back': 'Back to Store',
      
      // Admin Dashboard
      'admin.totalProducts': 'Total Products',
      'admin.totalOrders': 'Total Orders',
      'admin.totalRevenue': 'Total Revenue',
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
      'admin.description': 'Description',
      'admin.image': 'Image',
      'admin.category': 'Category',
      'admin.stock': 'Stock',
      'admin.actions': 'Actions',
      'admin.edit': 'Edit',
      'admin.delete': 'Delete',
      'admin.cancel': 'Cancel',
      'admin.update': 'Update',
      'admin.add': 'Add',
      
      // Admin Employees
      'admin.employeesTitle': 'Employees Management',
      'admin.addEmployee': 'Add Employee',
      'admin.name': 'Name',
      'admin.email': 'Email',
      'admin.password': 'Password',
      'admin.role': 'Role',
      'admin.permissions': 'Permissions',
      'admin.manageProducts': 'Manage Products',
      'admin.manageCategories': 'Manage Categories',
      'admin.manageOrders': 'Manage Orders',
      'admin.manageSite': 'Manage Site Settings',
      
      // Admin Accounts
      'admin.accountsTitle': 'Admin Accounts',
      'admin.superAdmin': 'Super Admin',
      'admin.fullAccess': 'Full Access',
      
      // General
      'general.orEnterUrl': 'Or enter image URL',
      'general.enter': 'Enter',
      'general.select': 'Select',
      'general.selectCategory': 'Select category',
      
      // Login
      'login.title': 'Admin Login',
      'login.email': 'Email',
      'login.password': 'Password',
      'login.button': 'Login',
      'login.invalid': 'Invalid email or password',
      'login.success': 'Admin login successful!',
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
