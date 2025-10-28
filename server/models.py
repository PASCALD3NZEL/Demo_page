from config import db, bcrypt
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime, timezone


class Client(db.Model, SerializerMixin):
    __tablename__ = 'clients'
    
    serialize_rules = ('-_password_hash', '-tasks.client', '-contracts.client')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)
    image = db.Column(db.Text)
    bio = db.Column(db.Text)
    contact = db.Column(db.String(100))
    location = db.Column(db.String(100))

    tasks = db.relationship('Task', back_populates='client')
    contracts = db.relationship('Contract', back_populates='client')

    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8')) 
        self._password_hash = password_hash.decode('utf-8')
    
    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f'<Client {self.id}: {self.name}>'


class Freelancer(db.Model, SerializerMixin):
    __tablename__ = 'freelancers'
    
    serialize_rules = ('-_password_hash', '-applications.freelancer', '-contracts.freelancer', '-experiences.freelancer')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    _password_hash = db.Column(db.Text, nullable=False)
    bio = db.Column(db.Text)
    image = db.Column(db.Text)
    contact = db.Column(db.String(100))
    location = db.Column(db.String(100))
    ratings = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    applications = db.relationship('Application', back_populates='freelancer')
    contracts = db.relationship('Contract', back_populates='freelancer')
    experiences = db.relationship('FreelancerExperience', back_populates='freelancer')

    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f'<Freelancer {self.id}: {self.name}>'


class Admin(db.Model, SerializerMixin):
    __tablename__ = 'admins'
    
    serialize_rules = ('-_password_hash', '-complaints.admin', '-audit_logs.admin')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    _password_hash = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    complaints = db.relationship('Complaint', back_populates='admin')
    audit_logs = db.relationship('AuditLog', back_populates='admin')

    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8')) 
        self._password_hash = password_hash.decode('utf-8')
    
    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f'<Admin {self.id}: {self.name}>'


class Task(db.Model, SerializerMixin):
    __tablename__ = 'tasks'
    
    serialize_rules = ('-client.tasks', '-applications.task', '-contract.task')

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'))
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    budget_min = db.Column(db.Integer)
    budget_max = db.Column(db.Integer)
    deadline = db.Column(db.Date)
    status = db.Column(db.String(30), default='open')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    client = db.relationship('Client', back_populates='tasks')
    applications = db.relationship('Application', back_populates='task')
    contract = db.relationship('Contract', back_populates='task')

    def __repr__(self):
        return f'<Task {self.id}: {self.title}>'


class Application(db.Model, SerializerMixin):
    __tablename__ = 'applications'
    
    serialize_rules = ('-task.applications', '-freelancer.applications')

    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'))
    freelancer_id = db.Column(db.Integer, db.ForeignKey('freelancers.id'))
    cover_letter = db.Column(db.Text)
    bid_amount = db.Column(db.Numeric)
    estimated_days = db.Column(db.Integer)
    status = db.Column(db.String(30), default='pending')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    task = db.relationship('Task', back_populates='applications')
    freelancer = db.relationship('Freelancer', back_populates='applications')

    def __repr__(self):
        return f'<Application {self.id}: Task {self.task_id} by Freelancer {self.freelancer_id}>'


class Contract(db.Model, SerializerMixin):
    __tablename__ = 'contracts'
    
    serialize_rules = ('-task.contract', '-client.contracts', '-freelancer.contracts', '-milestones.contract', '-payments.contract', '-reviews.contract', '-complaints.contract', '-messages.contract')

    id = db.Column(db.Integer, primary_key=True)
    contract_code = db.Column(db.String(100))
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'))
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'))
    freelancer_id = db.Column(db.Integer, db.ForeignKey('freelancers.id'))
    agreed_amount = db.Column(db.Numeric)
    started_at = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)
    status = db.Column(db.String(30), default='active')

    task = db.relationship('Task', back_populates='contract')
    client = db.relationship('Client', back_populates='contracts')
    freelancer = db.relationship('Freelancer', back_populates='contracts')
    milestones = db.relationship('Milestone', back_populates='contract')
    payments = db.relationship('Payment', back_populates='contract')
    reviews = db.relationship('Review', back_populates='contract')
    complaints = db.relationship('Complaint', back_populates='contract')
    messages = db.relationship('Message', back_populates='contract')

    def __repr__(self):
        return f'<Contract {self.id}: {self.contract_code}>'


class Milestone(db.Model, SerializerMixin):
    __tablename__ = 'milestones'
    
    serialize_rules = ('-contract.milestones',)

    id = db.Column(db.Integer, primary_key=True)
    contract_id = db.Column(db.Integer, db.ForeignKey('contracts.id'))
    title = db.Column(db.String(150))
    description = db.Column(db.Text)
    due_date = db.Column(db.Date)
    completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    weight = db.Column(db.Numeric)
    file_url = db.Column(db.Text)

    contract = db.relationship('Contract', back_populates='milestones')

    def __repr__(self):
        return f'<Milestone {self.id}: {self.title}>'


class Payment(db.Model, SerializerMixin):
    __tablename__ = 'payments'
    
    serialize_rules = ('-contract.payments',)

    id = db.Column(db.Integer, primary_key=True)
    contract_id = db.Column(db.Integer, db.ForeignKey('contracts.id'))
    payer_id = db.Column(db.Integer)
    payee_id = db.Column(db.Integer)
    amount = db.Column(db.Numeric)
    method = db.Column(db.String(50))
    status = db.Column(db.String(30), default='pending')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    contract = db.relationship('Contract', back_populates='payments')

    def __repr__(self):
        return f'<Payment {self.id}: ${self.amount} ({self.status})>'


class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'
    
    serialize_rules = ('-contract.reviews',)

    id = db.Column(db.Integer, primary_key=True)
    contract_id = db.Column(db.Integer, db.ForeignKey('contracts.id'))
    reviewer_id = db.Column(db.Integer)
    reviewee_id = db.Column(db.Integer)
    rating = db.Column(db.Integer)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    contract = db.relationship('Contract', back_populates='reviews')

    def __repr__(self):
        return f'<Review {self.id}: {self.rating}/5 stars>'


class Complaint(db.Model, SerializerMixin):
    __tablename__ = 'complaints'
    
    serialize_rules = ('-contract.complaints', '-admin.complaints')

    id = db.Column(db.Integer, primary_key=True)
    contract_id = db.Column(db.Integer, db.ForeignKey('contracts.id'))
    complainant_id = db.Column(db.Integer)
    respondent_id = db.Column(db.Integer)
    complainant_type = db.Column(db.String(20))
    description = db.Column(db.Text)
    status = db.Column(db.String(30), default='open')
    resolution = db.Column(db.Text)
    admin_id = db.Column(db.Integer, db.ForeignKey('admins.id'))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    resolved_at = db.Column(db.DateTime)

    contract = db.relationship('Contract', back_populates='complaints')
    admin = db.relationship('Admin', back_populates='complaints')

    def __repr__(self):
        return f'<Complaint {self.id}: {self.status}>'
    

class AuditLog(db.Model, SerializerMixin):
    __tablename__ = 'audit_logs'
    
    serialize_rules = ('-admin.audit_logs',)

    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('admins.id'))
    action = db.Column(db.Text)
    target_table = db.Column(db.String(50))
    target_id = db.Column(db.Integer)
    meta = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    admin = db.relationship('Admin', back_populates='audit_logs')

    def __repr__(self):
        return f'<AuditLog {self.id}: {self.action} on {self.target_table}>'



class Skill(db.Model, SerializerMixin):
    __tablename__ = 'skills'
    
    serialize_rules = ()

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

    def __repr__(self):
        return f'<Skill {self.id}: {self.name}>'


class FreelancerSkill(db.Model, SerializerMixin):
    __tablename__ = 'freelancer_skills'
    
    serialize_rules = ()

    freelancer_id = db.Column(db.Integer, db.ForeignKey('freelancers.id'), primary_key=True)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id'), primary_key=True)
    proficiency_level = db.Column(db.String(50))
    years_of_experience = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f'<FreelancerSkill: Freelancer {self.freelancer_id} - Skill {self.skill_id}>'


class TaskSkill(db.Model, SerializerMixin):
    __tablename__ = 'task_skills'
    
    serialize_rules = ()

    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), primary_key=True)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id'), primary_key=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f'<TaskSkill: Task {self.task_id} - Skill {self.skill_id}>'



class FreelancerExperience(db.Model, SerializerMixin):
    __tablename__ = 'freelancer_experiences'
    
    serialize_rules = ('-freelancer.experiences',)

    experience_id = db.Column(db.Integer, primary_key=True)
    freelancer_id = db.Column(db.Integer, db.ForeignKey('freelancers.id'))
    company_name = db.Column(db.String(150))
    role_title = db.Column(db.String(150))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    description = db.Column(db.Text)
    project_link = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    freelancer = db.relationship('Freelancer', back_populates='experiences')

    def __repr__(self):
        return f'<FreelancerExperience {self.experience_id}: {self.role_title} at {self.company_name}>'


class Message(db.Model, SerializerMixin):
    __tablename__ = 'messages'
    
    serialize_rules = ('-contract.messages',)

    id = db.Column(db.Integer, primary_key=True)
    contract_id = db.Column(db.Integer, db.ForeignKey('contracts.id'), nullable=False)
    sender_id = db.Column(db.Integer, nullable=False)
    receiver_id = db.Column(db.Integer, nullable=False)
    content = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    contract = db.relationship('Contract', back_populates='messages')

    def __repr__(self):
        return f'<Message {self.id}: Contract {self.contract_id}>'
