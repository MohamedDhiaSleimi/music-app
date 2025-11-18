# Database Migration for AccountStatus

## Pre-Migration Backup
```bash
mongodump --db music-app --out "C:\Users\user_one\Desktop\iset\l3_dsi3_isetR\projet_integration\project\backup-$(Get-Date -Format 'yyyyMMdd')"
```

## Migration Script (MongoDB Shell)
```javascript
db.users.find().forEach(function(user) {
    let newStatus;
    
    if (!user.active) {
        newStatus = "DEACTIVATED";
    } else if (user.deactivationRequestedAt) {
        newStatus = "DEACTIVATION_PENDING";
    } else if (user.emailVerified) {
        newStatus = "ACTIVE";
    } else {
        newStatus = "PENDING_VERIFICATION";
    }
    
    db.users.updateOne(
        { _id: user._id },
        { 
            $set: { status: newStatus },
            $unset: { emailVerified: "", active: "" }
        }
    );
});
```

## Verification Query
```javascript
db.users.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
]);
```