from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from log import log_bp, mail  # Import Blueprint and mail instance
from GetAdvice import advice_bp
from rec4 import rec_bp
from hyper6 import tsh_bp 
from personaldata import personal_bp
from pregnancy import preg_bp
from pregmail import email_bp
from charts import chart_bp

app = Flask(__name__)
CORS(app)

# Flask-Mail Configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'sliitresearchmail@gmail.com'
app.config['MAIL_PASSWORD'] = 'ddyj csxp iuhn wcns'
app.config['MAIL_DEFAULT_SENDER']='sliitresearchmail@gmail.com'  

# Initialize mail
mail.init_app(app)

# Register Blueprints
app.register_blueprint(log_bp, url_prefix='/auth')
app.register_blueprint(advice_bp, url_prefix='/advice')
app.register_blueprint(rec_bp, url_prefix='/recommend')
app.register_blueprint(tsh_bp, url_prefix='/tsh')
app.register_blueprint(personal_bp, url_prefix='/personaldata')
app.register_blueprint(preg_bp, url_prefix='/pregnancy')
app.register_blueprint(email_bp)
app.register_blueprint(chart_bp, url_prefix='/charts')




if __name__ == '__main__':
    app.run(debug=True)
