#ADMIN SIDE ROUTES
class AdminAuditLogsResource(Resource):
    def get(self, admin_id):
        audit_logs = AuditLog.query.filter_by(admin_id=admin_id).all()
        return make_response([log.to_dict(rules=('-admin', )) for log in audit_logs], 200)
api.add_resource(AdminAuditLogsResource, '/api/admins/<int:admin_id>/audit_logs')

class AdminAnalyticsResource(Resource):
    def get(self):
        from datetime import datetime, timedelta
        
        # Fetch all data
        clients = Client.query.all()
        freelancers = Freelancer.query.all()
        tasks = Task.query.all()
        contracts = Contract.query.all()
        payments = Payment.query.all()
        admins = Admin.query.all()

        # Calculate analytics
        totalClients = len(clients)
        totalFreelancers = len(freelancers)
        totalUsers = totalClients + totalFreelancers
        totalProjects = len(tasks)
        totalContracts = len(contracts)
        totalPayments = len(payments)

        # Calculate completed projects (contracts with status 'completed')
        completedContracts = len([c for c in contracts if c.status == 'completed'])
        completionRate = round((completedContracts / totalContracts * 100), 1) if totalContracts > 0 else 0.0

        # Calculate total revenue
        totalRevenue = sum(float(p.amount or 0) for p in payments)

        # Calculate average project value
        avgProjectValue = round((totalRevenue / totalPayments), 2) if totalPayments > 0 else 0.0

        # Calculate monthly growth (simplified - using creation dates)
        currentMonth = datetime.now().month
        currentYear = datetime.now().year

        newClientsThisMonth = len([c for c in clients if c.created_at and c.created_at.month == currentMonth and c.created_at.year == currentYear])
        newFreelancersThisMonth = len([f for f in freelancers if f.created_at and f.created_at.month == currentMonth and f.created_at.year == currentYear])
        newProjectsThisMonth = len([t for t in tasks if t.created_at and t.created_at.month == currentMonth and t.created_at.year == currentYear])

        # Calculate revenue by month (last 6 months)
        revenueByMonth = []
        for i in range(5, -1, -1):
            date = datetime.now() - timedelta(days=i*30)
            month = date.month
            year = date.year

            monthlyRevenue = sum(float(p.amount or 0) for p in payments if p.created_at and p.created_at.month == month and p.created_at.year == year)

            revenueByMonth.append({
                'month': date.strftime('%b %Y'),
                'revenue': monthlyRevenue
            })

        # Top performing freelancers (by number of completed contracts)
        freelancerStats = []
        for freelancer in freelancers:
            freelancerContracts = [c for c in contracts if c.freelancer_id == freelancer.id]
            completedCount = len([c for c in freelancerContracts if c.status == 'completed'])
            totalEarnings = sum(float(p.amount or 0) for p in payments if any(c.id == p.contract_id for c in freelancerContracts))

            freelancerStats.append({
                'name': freelancer.name,
                'completedProjects': completedCount,
                'totalEarnings': totalEarnings,
                'rating': freelancer.ratings or 4.5
            })

        topFreelancers = sorted(freelancerStats, key=lambda x: x['completedProjects'], reverse=True)[:5]

        # Project categories distribution
        projectCategories = {}
        for task in tasks:
            category = getattr(task, 'category', None) or 'General'
            projectCategories[category] = projectCategories.get(category, 0) + 1
  
        # Top user locations
        locationCounts = {}
        for user in clients + freelancers + admins:
            location = getattr(user, 'location', None) or 'Unknown'
            locationCounts[location] = locationCounts.get(location, 0) + 1

        topLocations = sorted([{'location': loc, 'count': count} for loc, count in locationCounts.items()], key=lambda x: x['count'], reverse=True)[:5]

        analytics = {
            'totalUsers': totalUsers,
            'totalClients': totalClients,
            'totalFreelancers': totalFreelancers,
            'totalProjects': totalProjects,
            'totalContracts': totalContracts,
            'completedContracts': completedContracts,
            'completionRate': completionRate,
            'totalRevenue': totalRevenue,
            'avgProjectValue': avgProjectValue,
            'newClientsThisMonth': newClientsThisMonth,
            'newFreelancersThisMonth': newFreelancersThisMonth,
            'newProjectsThisMonth': newProjectsThisMonth,
            'revenueByMonth': revenueByMonth,
            'topFreelancers': topFreelancers,
            'projectCategories': projectCategories,
            'topLocations': topLocations
        }

        return make_response(analytics, 200)

api.add_resource(AdminAnalyticsResource, '/api/admin/analytics')

class AdminComplaintResource(Resource):
    def get(self, complaint_id=None):
        if complaint_id:
            complaint = Complaint.query.get_or_404(complaint_id)
            return make_response(complaint.to_dict(rules=('-contract', '-admin',)), 200)
        complaints = Complaint.query.all()
        return make_response([complaint.to_dict(rules=('-contract', '-admin',)) for complaint in complaints], 200)
    
    def put(self, complaint_id):
        complaint = Complaint.query.get_or_404(complaint_id)
        data = request.get_json()
        for key, value in data.items():
            setattr(complaint, key, value)
        db.session.commit()
        return make_response(complaint.to_dict(rules=('-contract', '-admin',)), 200)
#used by an admin to fetch all complaints and edit a particular complaint
api.add_resource(AdminComplaintResource, '/api/admin/complaints', '/api/admin/complaints/<int:complaint_id>')
