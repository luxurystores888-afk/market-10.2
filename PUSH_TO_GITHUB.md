# كيفية عمل Push للـ GitHub

## المشكلة
GitHub ما عاد يقبل password عادي للـ authentication. لازم تستخدم Personal Access Token.

## الحل السريع (استخدم GitHub Desktop)

1. **حمّل GitHub Desktop** من: https://desktop.github.com/
2. **سجل دخول** بحسابك
3. **Add Existing Repository** واختار المجلد `market-10.2`
4. **اضغط Push origin**

✅ **هيك خلص! الأسهل والأسرع**

---

## الحل البديل (استخدم Personal Access Token)

### الخطوات:

1. **روح على GitHub** → Settings → Developer settings → Personal access tokens → Tokens (classic)
   
   أو مباشرة: https://github.com/settings/tokens

2. **اضغط "Generate new token"** → "Generate new token (classic)"

3. **اختار الصلاحيات:**
   - ✅ repo (كل شي تحت repo)
   - ✅ workflow (إذا بدك CI/CD)

4. **اضغط "Generate token"**

5. **انسخ الـ Token** (ما رح تقدر تشوفو مرة تانية!)

### استخدم الـ Token:

```bash
# طريقة 1: Push مباشرة مع Token
git push https://YOUR_TOKEN@github.com/luxurystores888-afk/market-10.2.git master

# طريقة 2: حفظ الـ credentials
git config --global credential.helper store
git push origin master
# رح يطلب منك username و password
# Username: luxurystores888-afk
# Password: [ضع الـ token هون مش الـ password]
```

---

## الحل الأسرع حالياً

**استخدم GitHub Desktop!** أسهل وأسرع وما في مشاكل! 🚀

---

بعد ما تعمل Push، روح على:
https://github.com/luxurystores888-afk/market-10.2/settings/branches

واضغط **"Protect this branch"** لحماية الـ master branch وما تشوف التنبيه مرة تانية.

