# Legal & Privacy Compliance Guide

## 🔒 Overview

Healthcare platforms handling medical data must comply with strict privacy and security regulations. This guide covers compliance requirements for operating in Africa and internationally.

## 🌍 Regulatory Landscape

### International Standards

#### HIPAA (Health Insurance Portability and Accountability Act) - USA
**Applies when**: Serving US patients or storing data in US

**Key Requirements**:
- **PHI Protection**: All personally identifiable health information must be encrypted
- **Minimum Necessary Rule**: Access only data needed for specific tasks
- **Audit Trails**: Log all access to patient data
- **Business Associate Agreements**: Required for all third-party services
- **Breach Notification**: Report breaches within 72 hours

#### GDPR (General Data Protection Regulation) - EU
**Applies when**: Serving EU patients or processing EU citizen data

**Key Requirements**:
- **Explicit Consent**: Clear, specific consent for data processing
- **Right to Erasure**: Patients can request data deletion
- **Data Portability**: Patients can export their data
- **Privacy by Design**: Build privacy into system architecture
- **Data Protection Officer**: Required for large-scale health data processing

### African Data Protection Laws

#### Nigeria - Nigeria Data Protection Regulation (NDPR)
```javascript
const ndprCompliance = {
  requirements: {
    dataMinimization: "Process only necessary data",
    consentManagement: "Explicit consent for health data",
    localDataStorage: "Critical data must be stored locally",
    dataBreachNotification: "Report within 72 hours",
    dataSubjectRights: "Access, rectification, erasure rights"
  },
  
  penalties: {
    minor: "NGN 2,000,000 or 1% of annual revenue",
    major: "NGN 10,000,000 or 2% of annual revenue"
  }
};
```

#### South Africa - Protection of Personal Information Act (POPIA)
```javascript
const popiaCompliance = {
  requirements: {
    lawfulnessPurpose: "Clear legal basis for processing",
    dataMinimization: "Collect only necessary information",
    consentManagement: "Written consent for health data",
    crossBorderTransfer: "Adequate protection required",
    securityMeasures: "Appropriate technical safeguards"
  }
};
```

#### Kenya - Data Protection Act
```javascript
const kenyanCompliance = {
  requirements: {
    dataControllerRegistration: "Register with Data Commissioner",
    consentRequirements: "Unambiguous consent required",
    dataRetention: "Data kept only as long as necessary",
    breachNotification: "Report within 24 hours",
    dataLocalization: "Public sector data must be stored locally"
  }
};
```

## 🛡️ Technical Implementation

### Data Classification System

```javascript
class DataClassificationService {
  static classifyData(data) {
    const classification = {
      public: [], // Marketing materials, general health tips
      internal: [], // Business analytics, aggregated data
      confidential: [], // Patient names, contact info
      restricted: [] // Medical records, payment info, SSNs
    };
    
    Object.keys(data).forEach(field => {
      switch (field) {
        case 'medicalRecords':
        case 'prescriptions':
        case 'labResults':
        case 'diagnosis':
          classification.restricted.push(field);
          break;
          
        case 'name':
        case 'email':
        case 'phone':
        case 'address':
          classification.confidential.push(field);
          break;
          
        case 'anonymizedMetrics':
        case 'aggregatedStatistics':
          classification.internal.push(field);
          break;
          
        default:
          classification.public.push(field);
      }
    });
    
    return classification;
  }
}
```

### Encryption Implementation

```javascript
class HealthDataEncryption {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyRotationPeriod = 90; // days
  }
  
  async encryptPHI(data) {
    const key = await this.getCurrentEncryptionKey();
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipher(this.algorithm, key, iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encryptedData: encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      keyVersion: await this.getCurrentKeyVersion()
    };
  }
  
  async decryptPHI(encryptedData, iv, authTag, keyVersion) {
    const key = await this.getEncryptionKey(keyVersion);
    
    const decipher = crypto.createDecipher(
      this.algorithm, 
      key, 
      Buffer.from(iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  }
}
```

### Access Control System

```javascript
class HealthDataAccessControl {
  async checkAccess(userId, resourceId, action) {
    const user = await this.getUserRoles(userId);
    const resource = await this.getResourceType(resourceId);
    
    const permissions = {
      patient: {
        ownRecords: ['read', 'update'],
        ownAppointments: ['read', 'create', 'update', 'cancel'],
        ownPrescriptions: ['read']
      },
      
      doctor: {
        patientRecords: ['read', 'update'], // Only assigned patients
        appointments: ['read', 'create', 'update', 'complete'],
        prescriptions: ['read', 'create', 'update']
      },
      
      nurse: {
        patientVitals: ['read', 'update'],
        appointments: ['read', 'update'],
        prescriptions: ['read']
      },
      
      admin: {
        userManagement: ['read', 'create', 'update', 'delete'],
        systemSettings: ['read', 'update'],
        reports: ['read', 'create']
      }
    };
    
    // Check if user has permission
    const userPermissions = permissions[user.role];
    const resourcePermissions = userPermissions[resource.type];
    
    if (!resourcePermissions || !resourcePermissions.includes(action)) {
      throw new Error('Access denied');
    }
    
    // Additional checks for patient data
    if (resource.type.includes('patient') && user.role === 'doctor') {
      await this.verifyDoctorPatientRelationship(userId, resource.patientId);
    }
    
    // Log access
    await this.logAccess(userId, resourceId, action, 'granted');
    
    return true;
  }
}
```

### Audit Logging System

```javascript
class AuditLogService {
  async logAccess(event) {
    const auditEntry = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      userId: event.userId,
      userRole: event.userRole,
      action: event.action,
      resourceType: event.resourceType,
      resourceId: event.resourceId,
      patientId: event.patientId,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      result: event.result, // 'granted', 'denied'
      reason: event.reason,
      sessionId: event.sessionId
    };
    
    // Store in tamper-proof audit log
    await this.storeAuditEntry(auditEntry);
    
    // Real-time monitoring for suspicious activity
    await this.monitorSuspiciousActivity(auditEntry);
  }
  
  async generateAuditReport(patientId, startDate, endDate) {
    const accessLogs = await this.queryAuditLogs({
      patientId,
      timestamp: { $gte: startDate, $lte: endDate }
    });
    
    return {
      totalAccesses: accessLogs.length,
      uniqueUsers: [...new Set(accessLogs.map(log => log.userId))],
      actionBreakdown: this.groupBy(accessLogs, 'action'),
      timeline: this.groupByDate(accessLogs),
      suspiciousActivity: accessLogs.filter(log => log.flagged)
    };
  }
}
```

## 📋 Consent Management

### Dynamic Consent System

```javascript
class ConsentManager {
  async requestConsent(userId, purposes) {
    const consentRequest = {
      id: uuidv4(),
      userId,
      timestamp: new Date().toISOString(),
      purposes: purposes.map(purpose => ({
        id: purpose.id,
        description: purpose.description,
        required: purpose.required,
        dataTypes: purpose.dataTypes,
        retentionPeriod: purpose.retentionPeriod,
        thirdParties: purpose.thirdParties
      })),
      version: await this.getCurrentConsentVersion()
    };
    
    await this.storeConsentRequest(consentRequest);
    
    return consentRequest;
  }
  
  async recordConsent(requestId, userChoices) {
    const consent = {
      requestId,
      userId: userChoices.userId,
      timestamp: new Date().toISOString(),
      ipAddress: userChoices.ipAddress,
      userAgent: userChoices.userAgent,
      consents: userChoices.choices.map(choice => ({
        purposeId: choice.purposeId,
        granted: choice.granted,
        timestamp: new Date().toISOString()
      })),
      signature: await this.generateConsentSignature(userChoices)
    };
    
    await this.storeConsent(consent);
    
    // Update user permissions
    await this.updateUserPermissions(consent.userId, consent.consents);
    
    return consent;
  }
  
  async withdrawConsent(userId, purposeId) {
    const withdrawal = {
      userId,
      purposeId,
      timestamp: new Date().toISOString(),
      reason: 'user_requested'
    };
    
    await this.storeConsentWithdrawal(withdrawal);
    
    // Immediately stop processing for this purpose
    await this.stopDataProcessing(userId, purposeId);
    
    // Schedule data deletion if required
    await this.scheduleDataDeletion(userId, purposeId);
  }
}
```

### Consent UI Components

```javascript
// React Component for Consent Collection
const ConsentForm = ({ purposes, onSubmit }) => {
  const [consents, setConsents] = useState({});
  
  const handleConsentChange = (purposeId, granted) => {
    setConsents(prev => ({
      ...prev,
      [purposeId]: granted
    }));
  };
  
  return (
    <div className="consent-form">
      <h2>Privacy Preferences</h2>
      <p>We respect your privacy. Please review and choose your preferences:</p>
      
      {purposes.map(purpose => (
        <div key={purpose.id} className="consent-item">
          <div className="consent-header">
            <h3>{purpose.title}</h3>
            {purpose.required && <span className="required">Required</span>}
          </div>
          
          <p>{purpose.description}</p>
          
          <div className="consent-details">
            <strong>Data used:</strong> {purpose.dataTypes.join(', ')}
            <br />
            <strong>Retention:</strong> {purpose.retentionPeriod}
            {purpose.thirdParties.length > 0 && (
              <>
                <br />
                <strong>Shared with:</strong> {purpose.thirdParties.join(', ')}
              </>
            )}
          </div>
          
          <div className="consent-choice">
            <label>
              <input
                type="radio"
                name={purpose.id}
                value="granted"
                onChange={() => handleConsentChange(purpose.id, true)}
                disabled={purpose.required}
                defaultChecked={purpose.required}
              />
              I agree
            </label>
            
            {!purpose.required && (
              <label>
                <input
                  type="radio"
                  name={purpose.id}
                  value="denied"
                  onChange={() => handleConsentChange(purpose.id, false)}
                />
                I decline
              </label>
            )}
          </div>
        </div>
      ))}
      
      <button onClick={() => onSubmit(consents)}>
        Save Preferences
      </button>
    </div>
  );
};
```

## 🔐 Data Security Framework

### Security Controls Matrix

```javascript
const securityControls = {
  dataAtRest: {
    encryption: 'AES-256',
    keyManagement: 'AWS KMS / Azure Key Vault',
    backupEncryption: 'Enabled',
    databaseEncryption: 'TDE (Transparent Data Encryption)'
  },
  
  dataInTransit: {
    protocol: 'TLS 1.3',
    certificateValidation: 'Required',
    hsts: 'Enabled',
    pinning: 'Certificate pinning for mobile apps'
  },
  
  dataInUse: {
    memoryEncryption: 'Intel SGX / AMD SME',
    applicationSecurity: 'OWASP compliance',
    inputValidation: 'Comprehensive sanitization',
    outputEncoding: 'Context-aware encoding'
  },
  
  accessControl: {
    authentication: 'Multi-factor required',
    authorization: 'Role-based + attribute-based',
    sessionManagement: 'Secure JWT with refresh tokens',
    passwordPolicy: 'NIST guidelines'
  }
};
```

### Incident Response Plan

```javascript
class IncidentResponsePlan {
  async handleSecurityIncident(incident) {
    const severity = this.assessSeverity(incident);
    
    // Immediate containment
    if (severity >= 'HIGH') {
      await this.containmentActions(incident);
    }
    
    // Notification timeline
    const notifications = {
      internal: '0 hours',
      legal: '2 hours',
      regulators: severity >= 'HIGH' ? '24 hours' : '72 hours',
      patients: severity >= 'CRITICAL' ? '24 hours' : '72 hours'
    };
    
    // Execute response plan
    await this.executeResponsePlan(incident, notifications);
    
    // Documentation
    await this.documentIncident(incident);
    
    // Post-incident review
    await this.schedulePostIncidentReview(incident);
  }
  
  async containmentActions(incident) {
    switch (incident.type) {
      case 'DATA_BREACH':
        await this.isolateAffectedSystems();
        await this.revokeCompromisedCredentials();
        await this.enableEnhancedMonitoring();
        break;
        
      case 'UNAUTHORIZED_ACCESS':
        await this.terminateActiveSessions();
        await this.requirePasswordReset();
        await this.enableTwoFactorAuth();
        break;
        
      case 'MALWARE':
        await this.quarantineAffectedSystems();
        await this.runSecurityScans();
        await this.updateSecuritySignatures();
        break;
    }
  }
}
```

## 📊 Privacy Impact Assessment

### PIA Framework

```javascript
class PrivacyImpactAssessment {
  async conductPIA(feature) {
    const assessment = {
      feature: feature.name,
      description: feature.description,
      dataFlows: await this.mapDataFlows(feature),
      privacyRisks: await this.identifyPrivacyRisks(feature),
      mitigations: await this.proposeMitigations(feature),
      complianceCheck: await this.checkCompliance(feature),
      recommendations: await this.generateRecommendations(feature)
    };
    
    const riskScore = this.calculateRiskScore(assessment);
    
    if (riskScore > 0.7) {
      assessment.requiresReview = true;
      assessment.reviewers = ['privacy-officer', 'legal-team', 'security-team'];
    }
    
    return assessment;
  }
  
  async mapDataFlows(feature) {
    return {
      dataCollection: {
        sources: feature.dataSources,
        types: feature.dataTypes,
        purposes: feature.purposes,
        legalBasis: feature.legalBasis
      },
      
      dataProcessing: {
        locations: feature.processingLocations,
        purposes: feature.processingPurposes,
        automated: feature.automatedDecisionMaking,
        profiling: feature.profiling
      },
      
      dataSharing: {
        recipients: feature.dataRecipients,
        purposes: feature.sharingPurposes,
        safeguards: feature.sharingControls,
        crossBorder: feature.crossBorderTransfers
      },
      
      dataRetention: {
        period: feature.retentionPeriod,
        criteria: feature.retentionCriteria,
        disposal: feature.disposalMethod
      }
    };
  }
}
```

## 🌍 Cross-Border Data Transfer

### Adequacy Assessment

```javascript
class CrossBorderTransferManager {
  async assessTransferLegality(fromCountry, toCountry, dataType) {
    const adequacyDecisions = {
      'EU': ['Andorra', 'Argentina', 'Canada', 'Switzerland', 'UK'],
      'UK': ['EU', 'EEA countries'],
      'Nigeria': ['ECOWAS countries'] // With adequate protection
    };
    
    const assessment = {
      isAdequate: adequacyDecisions[fromCountry]?.includes(toCountry),
      requiresSafeguards: !adequacyDecisions[fromCountry]?.includes(toCountry),
      dataType: dataType,
      recommendations: []
    };
    
    if (!assessment.isAdequate) {
      assessment.safeguards = [
        'Standard Contractual Clauses (SCCs)',
        'Binding Corporate Rules (BCRs)',
        'Certification schemes',
        'Codes of conduct'
      ];
    }
    
    return assessment;
  }
  
  async implementSafeguards(transfer) {
    if (transfer.requiresSafeguards) {
      // Implement Standard Contractual Clauses
      await this.implementSCCs(transfer);
      
      // Additional technical measures
      await this.implementTechnicalSafeguards(transfer);
      
      // Regular monitoring
      await this.establishMonitoring(transfer);
    }
  }
}
```

## 📝 Compliance Checklist

### Implementation Checklist

```markdown
## Data Protection Compliance Checklist

### Technical Measures
- [ ] End-to-end encryption implemented
- [ ] Database encryption enabled
- [ ] Key rotation automated (90-day cycle)
- [ ] Secure communication protocols (TLS 1.3)
- [ ] Access control system implemented
- [ ] Audit logging enabled
- [ ] Backup encryption configured
- [ ] Vulnerability scanning automated

### Administrative Measures
- [ ] Privacy policy published and updated
- [ ] Terms of service legally reviewed
- [ ] Staff privacy training completed
- [ ] Incident response plan documented
- [ ] Data retention policy defined
- [ ] Vendor agreements include privacy clauses
- [ ] Privacy impact assessments conducted
- [ ] Regular compliance audits scheduled

### Procedural Measures
- [ ] Consent management system deployed
- [ ] Data subject rights procedures defined
- [ ] Breach notification process tested
- [ ] Data minimization practices implemented
- [ ] Purpose limitation enforced
- [ ] Data accuracy procedures established
- [ ] Storage limitation controls active
- [ ] Accountability measures documented

### Legal Compliance
- [ ] Local data protection registration completed
- [ ] Cross-border transfer agreements signed
- [ ] Regulatory notifications submitted
- [ ] Legal basis for processing documented
- [ ] Data processing agreements executed
- [ ] Privacy notices provided to users
- [ ] Consent records maintained
- [ ] Right to erasure procedures implemented
```

### Ongoing Monitoring

```javascript
class ComplianceMonitoring {
  async generateComplianceReport() {
    const report = {
      timestamp: new Date().toISOString(),
      period: 'monthly',
      
      dataProcessingActivities: await this.auditDataProcessing(),
      consentStatus: await this.auditConsentStatus(),
      accessControls: await this.auditAccessControls(),
      securityIncidents: await this.getSecurityIncidents(),
      dataSubjectRequests: await this.getDataSubjectRequests(),
      vendorCompliance: await this.auditVendorCompliance(),
      
      riskAssessment: await this.assessComplianceRisks(),
      recommendations: await this.generateRecommendations(),
      nextAuditDate: this.calculateNextAuditDate()
    };
    
    // Automated compliance scoring
    report.complianceScore = this.calculateComplianceScore(report);
    
    return report;
  }
}
```

This comprehensive compliance framework ensures that the MedCare platform meets all necessary legal and regulatory requirements while maintaining the highest standards of data protection and privacy.
