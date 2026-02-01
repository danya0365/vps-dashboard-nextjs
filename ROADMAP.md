# VPS Dashboard - Future Roadmap

> เอกสารนี้เก็บ Feature Ideas สำหรับ Phase ถัดไป

---

## Phase 7: Real-time Updates

### WebSocket Integration
- เชื่อมต่อ WebSocket สำหรับ real-time server status
- Auto-update server metrics ทุก 5 วินาที
- Live CPU/RAM/Disk usage graphs
- Connection status indicator

### Implementation Notes
```
/src/infrastructure/websocket/
├── WebSocketClient.ts      # WebSocket connection manager
├── useServerMetrics.ts     # Hook for real-time metrics
└── ServerEventHandler.ts   # Event processor
```

---

## Phase 8: Billing & Cost Tracking

### Features
- เพิ่มหน้า `/billing` แสดงค่าใช้จ่าย
- Cost breakdown per server
- Monthly/Yearly cost projection
- Usage-based billing estimates
- Invoice history

### Data Models
```typescript
interface BillingRecord {
  id: string;
  serverId: string;
  period: { start: Date; end: Date };
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue';
}
```

---

## Phase 9: Backup Management

### Features
- Scheduled backup configuration
- One-click snapshot creation
- Restore from backup
- Backup retention policies
- Cross-region replication

### UI Components
- BackupScheduleModal
- SnapshotList
- RestoreConfirmDialog
- BackupProgress indicator

---

## Phase 10: Team & User Management

### Features
- User roles (Admin, Operator, Viewer)
- Team invitations
- Server access permissions
- Activity audit log
- Two-factor authentication

### Pages
- `/team` - Team member list
- `/team/invite` - Invitation flow
- `/team/roles` - Role management

---

## Phase 11: API Keys & Integrations

### Features
- API key generation
- Key permissions (read/write/admin)
- Usage statistics per key
- Webhook configuration
- Third-party integrations (Slack, Discord)

### Security
- Key rotation
- Rate limiting display
- IP whitelist configuration

---

## Phase 12: Advanced Monitoring

### Features
- Custom alert rules
- Uptime monitoring history
- Response time graphs
- Error rate tracking
- Status page generator

### Alerting Channels
- Email notifications
- SMS alerts
- Slack/Discord webhooks
- PagerDuty integration

---

## Priority Matrix

| Phase | Feature | Priority | Complexity |
|-------|---------|----------|------------|
| 7 | Real-time Updates | High | Medium |
| 8 | Billing | Medium | High |
| 9 | Backups | High | Medium |
| 10 | Team Mgmt | Medium | High |
| 11 | API Keys | Low | Medium |
| 12 | Monitoring | High | High |

---

## Tech Stack Recommendations

### For Real-time
- **Socket.io** or **Pusher** for WebSocket
- **React Query** for data caching
- **Recharts** for live graphs

### For Billing
- **Stripe** integration
- **Currency.js** for money handling

### For Auth/Team
- **NextAuth.js** สำหรับ authentication
- **Supabase** สำหรับ user management

---

> 📝 อัพเดทเอกสารนี้เมื่อเริ่มทำ Phase ใหม่
