# Security Hardening Guide

This guide covers security best practices for AgriGo 2.0 backend.

## 🔒 Security Checklist

### Authentication & Authorization
- [ ] Change default JWT_SECRET in production
- [ ] Use HTTPS only in production
- [ ] Implement token refresh mechanism
- [ ] Set appropriate token expiration
- [ ] Implement rate limiting on auth endpoints
- [ ] Add CAPTCHA for registration
- [ ] Log authentication attempts
- [ ] Implement account lockout after failed attempts

### Data Protection
- [ ] Enable encryption at rest (Supabase)
- [ ] Enable SSL/TLS for database connections
- [ ] Use prepared statements (prevent SQL injection)
- [ ] Validate and sanitize all inputs
- [ ] Implement data masking for sensitive fields
- [ ] Enable audit logging
- [ ] Regular backups with encryption

### API Security
- [ ] Enable CORS properly (whitelist origins)
- [ ] Implement rate limiting
- [ ] Add request size limits
- [ ] Use security headers (Helmet.js)
- [ ] Implement API versioning
- [ ] Add request signing (optional)
- [ ] Monitor for suspicious patterns

### Infrastructure
- [ ] Use environment variables for secrets
- [ ] Never commit .env files
- [ ] Use secrets management service
- [ ] Enable HTTPS/TLS
- [ ] Use WAF (Web Application Firewall)
- [ ] Monitor and log all access
- [ ] Regular security audits
- [ ] Keep dependencies updated

---

## 🛡️ Implemented Security Features

### 1. Input Validation
```javascript
// All inputs validated before processing
const validation = require('./utils/validation');

// Example
const { isValidEmail, isValidPassword } = validation;
```

### 2. Password Security
```javascript
// Passwords hashed with bcryptjs
const bcryptjs = require('bcryptjs');

// Salt rounds
const SALT_ROUNDS = 10;
```

### 3. JWT Authentication
```javascript
// Token-based authentication
// Tokens verified on protected routes
// Include user role in token
```

### 4. Role-Based Access Control
```javascript
// Farmers can only perform farmer actions
// Providers can only perform provider actions
// Enforced via middleware
```

### 5. CORS Protection
```javascript
// Whitelist specific origins
// Prevent cross-origin attacks
// Configured in backend/src/index.js
```

---

## 🔐 Security Enhancements (Ready to Implement)

### 1. Rate Limiting
```javascript
// Add to backend/src/index.js
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                     // 5 requests per windowMs
  message: 'Too many attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

app.post('/auth/login', authLimiter, authController.login);
app.post('/auth/register', authLimiter, authController.register);
```

### 2. Security Headers
```javascript
// Add to backend/src/index.js
const helmet = require('helmet');

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:']
  }
}));
```

### 3. Request Size Limiting
```javascript
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb' }));
```

### 4. Input Sanitization
```javascript
// Add to controller before processing
const sanitizeString = (str) => {
  return str.trim().replace(/[<>]/g, '');
};
```

### 5. SQL Injection Prevention
```javascript
// Already implemented via Supabase client
// Supabase uses parameterized queries
// No manual SQL queries used
```

### 6. XSS Protection
```javascript
// Helmet.js provides XSS protection
// Content Security Policy headers
// Input validation prevents script injection
```

### 7. CSRF Protection (If needed)
```javascript
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(csrf({ cookie: false }));
```

---

## 🔑 Secret Management

### Current Approach
```
Environment Variables via DevServerControl
├── SUPABASE_URL
├── SUPABASE_ANON_KEY
├── JWT_SECRET (not set, use default)
└── ... other variables
```

### Production Approach
```
Use Secrets Management Service:

Option 1: AWS Secrets Manager
├── Automatic rotation
├── Encrypted storage
├── Audit logging
└── Access control

Option 2: HashiCorp Vault
├── Centralized secrets
├── Encryption
├── Audit trails
└── Role-based access

Option 3: Supabase Vault
├── Built-in to Supabase
├── Encrypted secrets
└── Easy integration
```

### Implementation
```javascript
// Example: Using AWS Secrets Manager
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();

const getSecret = async (secretName) => {
  try {
    const data = await secretsManager
      .getSecretValue({ SecretId: secretName })
      .promise();
    
    return JSON.parse(data.SecretString);
  } catch (error) {
    console.error('Error retrieving secret:', error);
    throw error;
  }
};

// Usage
const supabaseKey = await getSecret('agrigo/supabase-key');
```

---

## 🚨 Incident Response

### Security Incident Checklist
- [ ] Identify the incident
- [ ] Isolate affected systems
- [ ] Notify stakeholders
- [ ] Collect evidence
- [ ] Contain the damage
- [ ] Eradicate the threat
- [ ] Recover systems
- [ ] Conduct post-incident review

### Key Contact Information
```
Security Officer: security@agrigo.com
DevOps Lead: devops@agrigo.com
Database Admin: dba@agrigo.com
Legal Team: legal@agrigo.com
```

---

## 🔄 Regular Security Practices

### Weekly
- [ ] Review application logs
- [ ] Check for failed login attempts
- [ ] Verify backups completed

### Monthly
- [ ] Security updates for dependencies
- [ ] Review access logs
- [ ] Check database size and performance
- [ ] Verify SSL certificate status

### Quarterly
- [ ] Security audit
- [ ] Penetration testing (external)
- [ ] Review security policies
- [ ] Update disaster recovery plan

### Annually
- [ ] Full security assessment
- [ ] Compliance audit
- [ ] Update security training
- [ ] Review and update incident response plan

---

## 📋 OWASP Top 10 Compliance

### 1. Broken Authentication
- ✅ JWT tokens with expiration
- ✅ Secure password hashing
- ✅ Input validation

### 2. Broken Access Control
- ✅ Role-based access control
- ✅ Permission enforcement
- ✅ Resource ownership checks

### 3. Sensitive Data Exposure
- ✅ HTTPS ready
- ✅ Password hashing
- ✅ Environment variable protection
- 🔜 Add encryption at rest

### 4. XML External Entities (XXE)
- ✅ No XML processing
- ✅ JSON API only

### 5. Broken Access Control
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ Prepared statements

### 6. Security Misconfiguration
- ✅ Environment variables
- ✅ CORS configuration
- 🔜 Security headers

### 7. Cross-Site Scripting (XSS)
- ✅ Input validation
- ✅ Output encoding
- 🔜 Content Security Policy

### 8. Insecure Deserialization
- ✅ JSON validation
- ✅ Type checking

### 9. Using Components with Known Vulnerabilities
- 🔜 Regular dependency updates
- 🔜 Security scanning (npm audit)

### 10. Insufficient Logging & Monitoring
- ✅ Request logging
- 🔜 Error tracking (Sentry)
- 🔜 Performance monitoring

---

## 🔍 Vulnerability Scanning

### NPM Audit
```bash
npm audit
npm audit fix
npm audit fix --force  # Use with caution
```

### SNYK
```bash
npm install -g snyk
snyk auth
snyk test
snyk monitor
```

### Semgrep
```bash
# Scan code for security issues
semgrep --config=p/security-audit .
```

---

## 📈 Security Metrics

Track these metrics over time:

```
- Failed login attempts per day
- API errors by type
- Average response time
- Database query performance
- SSL certificate expiration
- Backup success rate
- Security patch lag
- Vulnerability scan results
```

---

## 🎓 Security Training

### For Developers
- [ ] OWASP Top 10
- [ ] Secure coding practices
- [ ] Authentication & authorization
- [ ] Encryption basics
- [ ] Security testing

### For DevOps
- [ ] Infrastructure security
- [ ] Network security
- [ ] Database security
- [ ] CI/CD security
- [ ] Incident response

### For All
- [ ] Phishing awareness
- [ ] Social engineering
- [ ] Password hygiene
- [ ] Data protection
- [ ] Reporting procedures

---

## 📞 Security Resources

### Documentation
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- NIST Cybersecurity: https://www.nist.gov/cyberframework
- CWE/SANS Top 25: https://cwe.mitre.org/top25/

### Tools
- Snyk: https://snyk.io/
- OWASP ZAP: https://www.zaproxy.org/
- Burp Suite: https://portswigger.net/burp
- npm audit: Built-in to npm

### Services
- AWS Security: https://aws.amazon.com/security/
- Supabase Security: https://supabase.com/docs/guides/security
- Firebase Security: https://firebase.google.com/support/security

---

## ✅ Production Readiness Checklist

### Before Going Live
- [ ] All secrets in secure storage
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] Logging enabled
- [ ] Monitoring active
- [ ] Backups tested
- [ ] Disaster recovery plan ready
- [ ] Incident response plan defined
- [ ] Security headers configured
- [ ] Dependencies scanned
- [ ] Code reviewed
- [ ] Penetration test completed

### Ongoing
- [ ] Monitor logs daily
- [ ] Update dependencies monthly
- [ ] Security audit quarterly
- [ ] Penetration test annually
- [ ] Backup verification weekly

---

## 🚀 Security Roadmap

### Phase 1 (Immediate)
- [x] Input validation
- [x] Password hashing
- [x] JWT authentication
- [x] RBAC
- [x] CORS

### Phase 2 (This Week)
- [ ] Rate limiting
- [ ] Security headers
- [ ] Request logging
- [ ] HTTPS setup

### Phase 3 (This Month)
- [ ] Encryption at rest
- [ ] Audit logging
- [ ] Error tracking (Sentry)
- [ ] Security scanning

### Phase 4 (This Quarter)
- [ ] Penetration testing
- [ ] Compliance audit
- [ ] Disaster recovery
- [ ] Security training

---

**Last Updated:** October 17, 2025  
**Security Level:** High  
**Next Review:** November 17, 2025
