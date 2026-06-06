document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('generate');
  const roadmapEl = document.getElementById('roadmap');

  btn.addEventListener('click', () => {
    const rawCareer = document.getElementById('career').value || '';
    const careerInput = rawCareer.trim();
    const level = document.getElementById('level').value || '';
    const hours = parseFloat(document.getElementById('hours').value);

    if (!careerInput || !level || !hours || hours <= 0) {
      renderError('Please enter a career goal, choose a skill level, and add daily study hours greater than 0.');
      return;
    }

    const detectedLabel = detectCategory(careerInput);
    const template = getTemplate(detectedLabel);
    if (!template) {
      renderError('CareerPilot AI currently specializes in Engineering and Technology career roadmaps. Additional domains will be added in future updates.');
      return;
    }

    const monthCount = determineMonthCount(level, hours);
    const roadmap = template.slice(0, monthCount).map((m, i) => ({
      month: i + 1,
      skills: m.skills,
      tools: m.tools,
      project: m.project,
      resource: m.resource,
      focus: m.focus
    }));

    renderRoadmap(roadmap, detectedLabel, careerInput, level);
    roadmapEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  function renderError(msg) {
    roadmapEl.innerHTML = `<div class="roadmap"><div class="empty">${escapeHtml(msg)}</div></div>`;
  }

  function renderRoadmap(roadmap, detectedLabel, rawCareer, level) {
    roadmapEl.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = `
      <p class="eyebrow">Detected Engineering Domain</p>
      <h2>${escapeHtml(detectedLabel)}</h2>
      <p class="muted">Career goal: ${escapeHtml(rawCareer)} · Skill level: ${escapeHtml(level)}</p>
    `;
    roadmapEl.appendChild(header);

    const cards = document.createElement('div');
    cards.className = 'cards';

    roadmap.forEach(item => {
      const card = document.createElement('article');
      card.className = 'card';

      const monthTitle = document.createElement('h3');
      monthTitle.textContent = `Month ${item.month}`;
      card.appendChild(monthTitle);

      const focus = document.createElement('p');
      focus.className = 'card-subtitle';
      focus.textContent = item.focus;
      card.appendChild(focus);

      const skillsTitle = document.createElement('strong');
      skillsTitle.textContent = 'Skills to learn';
      card.appendChild(skillsTitle);

      const skillsList = document.createElement('ul');
      item.skills.forEach(skill => {
        const li = document.createElement('li');
        li.textContent = skill;
        skillsList.appendChild(li);
      });
      card.appendChild(skillsList);

      const tools = document.createElement('p');
      tools.innerHTML = `<strong>Recommended tools:</strong> ${escapeHtml(item.tools.join(', '))}`;
      card.appendChild(tools);

      const project = document.createElement('p');
      project.innerHTML = `<strong>Suggested project:</strong> ${escapeHtml(item.project)}`;
      card.appendChild(project);

      const resource = document.createElement('p');
      resource.innerHTML = `<strong>Recommended resource:</strong> ${escapeHtml(item.resource)}`;
      card.appendChild(resource);

      cards.appendChild(card);
    });

    roadmapEl.appendChild(cards);
  }

  function normalize(input) {
    return input.toLowerCase().replace(/[\-_.\/\\]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function updateBestMatch(current, label, score) {
    if (score > current.score) {
      return { label, score };
    }
    return current;
  }

  function detectCategory(input) {
    const normalized = normalize(input);
    const categoryMap = {
      'Software Engineer': ['software engineer', 'software developer', 'programmer'],
      'AI Engineer': ['ai engineer', 'artificial intelligence engineer', 'ai developer', 'artificial intelligence'],
      'Machine Learning Engineer': ['machine learning engineer', 'ml engineer', 'machine learning', 'ml'],
      'Data Scientist': ['data scientist', 'data science'],
      'Data Analyst': ['data analyst', 'data analytics'],
      'Web Developer': ['web developer', 'web dev', 'web development'],
      'Frontend Developer': ['frontend developer', 'front end developer', 'ui developer'],
      'Backend Developer': ['backend developer', 'back end developer', 'api developer'],
      'Full Stack Developer': ['full stack developer', 'full-stack developer', 'fullstack developer'],
      'Cyber Security Engineer': ['cyber security engineer', 'cybersecurity engineer', 'security engineer', 'security specialist'],
      'Ethical Hacker': ['ethical hacker', 'penetration tester', 'pentester'],
      'Cloud Engineer': ['cloud engineer', 'cloud developer', 'cloud infrastructure'],
      'DevOps Engineer': ['devops engineer', 'site reliability engineer', 'sre'],
      'Cloud Architect': ['cloud architect', 'cloud architecture', 'cloud solution architect'],
      'Mechanical Engineer': ['mechanical engineer', 'mechanical design', 'mech engineer'],
      'Civil Engineer': ['civil engineer', 'civil engineering'],
      'Electrical Engineer': ['electrical engineer', 'electrical engineering'],
      'Electronics Engineer': ['electronics engineer', 'electronic engineer', 'electronics design'],
      'Robotics Engineer': ['robotics engineer', 'robotic engineer', 'robotics'],
      'Mechatronics Engineer': ['mechatronics engineer', 'mechatronic engineer', 'mechatronics'],
      'Automobile Engineer': ['automobile engineer', 'automotive engineer', 'automotive'],
      'Biomedical Engineer': ['biomedical engineer', 'biomedical engineering', 'bioengineer'],
      'Aerospace Engineer': ['aerospace engineer', 'aircraft engineer', 'aerospace'],
      'Chemical Engineer': ['chemical engineer', 'chemical engineering'],
      'Environmental Engineer': ['environmental engineer', 'environmental engineering', 'sustainability engineer']
    };

    let bestMatch = { label: null, score: 0 };
    const tokens = normalized.split(' ');

    Object.entries(categoryMap).forEach(([label, synonyms]) => {
      synonyms.forEach(synonym => {
        if (normalized === synonym) {
          bestMatch = { label, score: 100 };
          return;
        }

        if (normalized.includes(synonym)) {
          bestMatch = updateBestMatch(bestMatch, label, 50);
        }

        const synonymTokens = synonym.split(' ');
        tokens.forEach(token => {
          if (synonymTokens.includes(token)) {
            bestMatch = updateBestMatch(bestMatch, label, 10);
          }
        });
      });
    });

    return bestMatch.label;
  }

  function determineMonthCount(level, hours) {
    if (level === 'Beginner' || hours < 2) return 5;
    if (level === 'Intermediate' || hours <= 4) return 4;
    return 3;
  }

  function getTemplate(label) {
    const templates = {
      'Software Engineer': [
        { focus: 'Core engineering foundations', skills: ['Algorithms', 'Data structures', 'Debugging workflows'], tools: ['VS Code', 'Git', 'Docker'], project: 'Build a CLI utility with tests', resource: 'CS50 or similar core engineering track' },
        { focus: 'Service architecture', skills: ['REST APIs', 'Relational databases', 'Modular design'], tools: ['Postman', 'Node.js/Express', 'PostgreSQL'], project: 'Create a service-backed app', resource: 'System design primers' },
        { focus: 'Quality engineering', skills: ['Unit testing', 'Integration tests', 'Continuous integration'], tools: ['Jest', 'GitHub Actions', 'Docker'], project: 'Add a CI pipeline to app', resource: 'Testing and CI guides' },
        { focus: 'Performance engineering', skills: ['Profiling', 'Concurrency', 'Caching'], tools: ['Profiler', 'Redis', 'NGINX'], project: 'Optimize app bottlenecks', resource: 'Performance engineering resources' },
        { focus: 'Distributed systems basics', skills: ['Message queues', 'Load balancing', 'API scaling'], tools: ['RabbitMQ', 'NGINX', 'Kubernetes'], project: 'Design a scalable service component', resource: 'Distributed systems courses' }
      ],
      'AI Engineer': [
        { focus: 'AI foundations', skills: ['Machine learning basics', 'Python data tooling', 'Model evaluation'], tools: ['numpy', 'pandas', 'scikit-learn'], project: 'Build a sentiment analysis model', resource: 'AI specialization or Coursera ML' },
        { focus: 'Deep learning pipelines', skills: ['Neural networks', 'Tensor operations', 'Training loops'], tools: ['PyTorch', 'TensorBoard', 'Weights & Biases'], project: 'Train an image classifier', resource: 'fast.ai or PyTorch tutorials' },
        { focus: 'AI model ops', skills: ['Model serving', 'Versioning', 'Monitoring'], tools: ['FastAPI', 'Docker', 'MLflow'], project: 'Deploy AI model as API', resource: 'MLOps practical guides' },
        { focus: 'Data management', skills: ['Feature engineering', 'Data pipelines', 'Dataset validation'], tools: ['Airflow', 'Great Expectations', 'Pandas'], project: 'Build a data validation pipeline', resource: 'AI engineering docs' },
        { focus: 'AI scaling', skills: ['Inference optimization', 'GPU workflows', 'Batch prediction'], tools: ['ONNX', 'CUDA', 'Kubernetes'], project: 'Optimize AI inference service', resource: 'Scale AI deployment resources' }
      ],
      'Machine Learning Engineer': [
        { focus: 'Foundations of ML engineering', skills: ['Statistical modeling', 'Supervised learning', 'Python tooling'], tools: ['scikit-learn', 'Jupyter', 'Git'], project: 'Implement regression and classification solutions', resource: 'Hands-on ML book' },
        { focus: 'Pipeline engineering', skills: ['Feature pipelines', 'Data versioning', 'Batch processing'], tools: ['Airflow', 'DVC', 'Pandas'], project: 'Build a reusable ML pipeline', resource: 'Data engineering tutorials' },
        { focus: 'Production readiness', skills: ['Model serving', 'API design', 'Logging'], tools: ['FastAPI', 'Docker', 'Prometheus'], project: 'Deploy a model API with health checks', resource: 'MLOps practical guides' },
        { focus: 'Performance tuning', skills: ['Hyperparameter tuning', 'Profiling', 'Calibration'], tools: ['Optuna', 'TensorBoard', 'W&B'], project: 'Tune model for production', resource: 'Advanced ML operational guides' },
        { focus: 'Scaling and reliability', skills: ['Distributed training', 'Infrastructure automation', 'Monitoring'], tools: ['Kubernetes', 'Terraform', 'Grafana'], project: 'Scale model training and serving', resource: 'Cloud ML architecture resources' }
      ],
      'Data Scientist': [
        { focus: 'Data investigation', skills: ['Exploratory analysis', 'SQL', 'Statistical inference'], tools: ['pandas', 'SQL', 'Jupyter'], project: 'Deliver a data analysis report', resource: 'Kaggle data science paths' },
        { focus: 'Model development', skills: ['Regression', 'Tree models', 'Validation'], tools: ['scikit-learn', 'XGBoost', 'Matplotlib'], project: 'Build a predictive model', resource: 'Hands-on ML book' },
        { focus: 'Advanced analytics', skills: ['Time-series', 'Clustering', 'Feature engineering'], tools: ['Statsmodels', 'scikit-learn', 'Seaborn'], project: 'Create a forecasting or clustering project', resource: 'Data science specialization' },
        { focus: 'Data productization', skills: ['Data pipelines', 'APIs', 'Model deployment'], tools: ['Flask', 'Docker', 'Airflow'], project: 'Deploy analysis as service', resource: 'Data engineering guides' },
        { focus: 'Interpretability', skills: ['Explainable AI', 'Dashboarding', 'Experiment tracking'], tools: ['SHAP', 'Plotly', 'MLflow'], project: 'Build an explainable analytics dashboard', resource: 'Explainability resources' }
      ],
      'Data Analyst': [
        { focus: 'Data collection and cleanup', skills: ['SQL', 'data wrangling', 'data validation'], tools: ['Excel', 'SQL', 'OpenRefine'], project: 'Build a cleaned dataset for analysis', resource: 'Mode SQL tutorials' },
        { focus: 'Business reporting', skills: ['Dashboards', 'KPI definition', 'Visualization'], tools: ['Tableau', 'Power BI', 'Looker'], project: 'Create an interactive dashboard', resource: 'Tableau/Power BI docs' },
        { focus: 'Analytical patterns', skills: ['Cohort analysis', 'Trend analysis', 'Segmentation'], tools: ['SQL', 'Python', 'Excel'], project: 'Perform a business metric analysis', resource: 'Practical data analysis courses' },
        { focus: 'Automation', skills: ['ETL', 'SQL automation', 'API ingestion'], tools: ['Airflow', 'Zapier', 'Python'], project: 'Automate a reporting pipeline', resource: 'ETL and dashboarding guides' },
        { focus: 'Advanced reporting', skills: ['Data modeling', 'Performance tuning', 'Storytelling'], tools: ['Looker', 'Power BI', 'SQL'], project: 'Deliver a polished stakeholder dashboard', resource: 'Enterprise BI resources' }
      ],
      'Web Developer': [
        { focus: 'HTML, CSS and JavaScript', skills: ['Responsive layout', 'DOM manipulation', 'Web accessibility'], tools: ['VS Code', 'Chrome DevTools', 'Git'], project: 'Build a responsive marketing site', resource: 'freeCodeCamp Responsive Web Design' },
        { focus: 'Modern frontend', skills: ['SPA frameworks', 'State management', 'Routing'], tools: ['React', 'Vue', 'Vite'], project: 'Build a single-page app', resource: 'Official framework docs' },
        { focus: 'Backend basics', skills: ['REST APIs', 'Data storage', 'Authentication'], tools: ['Node.js', 'Express', 'MongoDB'], project: 'Add backend services to your app', resource: 'MDN full-stack guide' },
        { focus: 'Security and performance', skills: ['App security', 'Asset optimization', 'Caching'], tools: ['Lighthouse', 'Helmet', 'Redis'], project: 'Harden and optimize the app', resource: 'Google Web Fundamentals' },
        { focus: 'Deployment and monitoring', skills: ['CI/CD', 'Hosting', 'Logs'], tools: ['Netlify', 'Vercel', 'GitHub Actions'], project: 'Deploy a production-ready web app', resource: 'Netlify/Vercel docs' }
      ],
      'Frontend Developer': [
        { focus: 'Interaction and UI basics', skills: ['Accessibility', 'Responsive UI', 'Component design'], tools: ['Figma', 'Storybook', 'Chrome DevTools'], project: 'Build an accessible UI component library', resource: 'A11y guides and modern JS courses' },
        { focus: 'Advanced JavaScript', skills: ['ES6+', 'Asynchronous flows', 'DOM performance'], tools: ['TypeScript', 'Webpack', 'Babel'], project: 'Create an interactive dashboard', resource: 'Modern JavaScript courses' },
        { focus: 'Framework mastery', skills: ['React/Vue', 'State management', 'Composition patterns'], tools: ['React', 'Vue', 'Redux/Pinia'], project: 'Build a complex SPA', resource: 'Official framework docs' },
        { focus: 'Design systems', skills: ['Theme tokens', 'Component variants', 'Scalability'], tools: ['Storybook', 'Tailwind', 'CSS Modules'], project: 'Create a design system repo', resource: 'Design system guides' },
        { focus: 'Optimizing frontend', skills: ['Lighthouse', 'Lazy loading', 'Bundle splitting'], tools: ['Lighthouse', 'Webpack', 'Vite'], project: 'Audit and improve performance', resource: 'Web performance resources' }
      ],
      'Backend Developer': [
        { focus: 'Server fundamentals', skills: ['API design', 'Error handling', 'Database integration'], tools: ['Node.js', 'Express', 'PostgreSQL'], project: 'Build a REST API service', resource: 'Backend development tutorials' },
        { focus: 'Data persistence', skills: ['SQL/NoSQL', 'ORMs', 'Schema design'], tools: ['PostgreSQL', 'MongoDB', 'Prisma'], project: 'Create a data-driven service', resource: 'Database guides' },
        { focus: 'Scalability', skills: ['Caching', 'Message queues', 'Load balancing'], tools: ['Redis', 'RabbitMQ', 'NGINX'], project: 'Scale an API service', resource: 'Architecture courses' },
        { focus: 'Security', skills: ['Authentication', 'Input validation', 'Secret management'], tools: ['OAuth', 'JWT', 'Vault'], project: 'Secure a backend service', resource: 'OWASP guides' },
        { focus: 'Reliability', skills: ['Monitoring', 'Alerts', 'Failover'], tools: ['Prometheus', 'Grafana', 'Sentry'], project: 'Add observability to service', resource: 'SRE resource guides' }
      ],
      'Full Stack Developer': [
        { focus: 'End-to-end application', skills: ['Frontend + backend integration', 'API consumption', 'Database basics'], tools: ['React', 'Node.js', 'PostgreSQL'], project: 'Build a full-stack app', resource: 'Full-stack bootcamp guides' },
        { focus: 'Authentication and state', skills: ['Auth flows', 'Session management', 'State sync'], tools: ['JWT', 'Redux', 'OAuth'], project: 'Add auth and user state', resource: 'Practical full-stack guides' },
        { focus: 'Testing and quality', skills: ['Unit tests', 'E2E tests', 'Contract testing'], tools: ['Jest', 'Cypress', 'Supertest'], project: 'Add test coverage', resource: 'Testing documentation' },
        { focus: 'Deployment', skills: ['Containers', 'CI/CD', 'Environment config'], tools: ['Docker', 'GitHub Actions', 'Heroku/AWS'], project: 'Deploy with CI pipeline', resource: 'Deployment guides' },
        { focus: 'Product polish', skills: ['Performance', 'Security', 'UX feedback'], tools: ['Lighthouse', 'Sentry', 'Postman'], project: 'Release polished product', resource: 'Best practices resources' }
      ],
      'Cyber Security Engineer': [
        { focus: 'Security fundamentals', skills: ['Network security', 'Linux hardening', 'Threat models'], tools: ['Wireshark', 'Nmap', 'Kali Linux'], project: 'Build a security lab', resource: 'TryHackMe beginner paths' },
        { focus: 'Detection and defense', skills: ['SIEM basics', 'Log analysis', 'Intrusion detection'], tools: ['Elastic Stack', 'Splunk', 'Sysmon'], project: 'Set up log monitoring', resource: 'SIEM guides' },
        { focus: 'Vulnerability assessment', skills: ['Scanning', 'Patch review', 'Secure config'], tools: ['Nessus', 'OpenVAS', 'OSQuery'], project: 'Run a vulnerability assessment', resource: 'OWASP and vuln management docs' },
        { focus: 'Incident response', skills: ['Forensics', 'Containment', 'Root cause'], tools: ['Volatility', 'Autopsy', 'Kali'], project: 'Document incident response workflow', resource: 'IR resources' },
        { focus: 'Secure operations', skills: ['Access control', 'Encryption', 'Policy enforcement'], tools: ['Vault', 'AWS KMS', 'IAM'], project: 'Harden a cloud environment', resource: 'Security operations guides' }
      ],
      'Ethical Hacker': [
        { focus: 'Penetration basics', skills: ['Reconnaissance', 'Scanning', 'Enumeration'], tools: ['Nmap', 'Recon-ng', 'Burp Suite'], project: 'Map and scan a target lab', resource: 'TryHackMe / Hack The Box' },
        { focus: 'Exploit research', skills: ['Vulnerability analysis', 'Exploit chaining', 'Payloads'], tools: ['Metasploit', 'Python', 'Burp Suite'], project: 'Exploit a lab vulnerability', resource: 'Pentest learning paths' },
        { focus: 'Web application hacking', skills: ['XSS', 'SQLi', 'Auth bypass'], tools: ['Burp', 'SQLmap', 'WebGoat'], project: 'Exploit a web app', resource: 'OWASP WebGoat' },
        { focus: 'Post-exploitation', skills: ['Persistence', 'Privilege escalation', 'Data exfiltration'], tools: ['Meterpreter', 'BloodHound', 'Empire'], project: 'Build a post-exploitation report', resource: 'Red team resources' },
        { focus: 'Reporting and defense', skills: ['Findings communication', 'Remediation tracking', 'Attack chains'], tools: ['Dradis', 'Markdown', 'ELK'], project: 'Write a pentest report', resource: 'Pentest documentation guides' }
      ],
      'Cloud Engineer': [
        { focus: 'Cloud fundamentals', skills: ['IAM', 'Networking', 'Storage'], tools: ['AWS/Azure/GCP console', 'CloudShell', 'Terraform'], project: 'Set up cloud landing zone', resource: 'Cloud provider fundamentals' },
        { focus: 'Compute and containerization', skills: ['VMs', 'Serverless', 'Containers'], tools: ['Docker', 'ECS/GKE', 'Lambda'], project: 'Deploy app in cloud', resource: 'Cloud tutorials' },
        { focus: 'Scaling and reliability', skills: ['Autoscaling', 'Load balancing', 'Caching'], tools: ['Cloud load balancers', 'Redis', 'CloudWatch'], project: 'Build a scalable service', resource: 'Cloud architecture guides' },
        { focus: 'Security and compliance', skills: ['Encryption', 'IAM policies', 'Logging'], tools: ['KMS', 'CloudTrail', 'Security Hub'], project: 'Secure a cloud deployment', resource: 'Cloud security docs' },
        { focus: 'Architecture and cost', skills: ['Well-architected design', 'Cost optimization', 'Resilience'], tools: ['Terraform', 'Cost Explorer', 'CloudFormation'], project: 'Design a cost-optimized architecture', resource: 'Cloud architecture patterns' }
      ],
      'DevOps Engineer': [
        { focus: 'Infrastructure fundamentals', skills: ['Linux tooling', 'Networking basics', 'Scripting'], tools: ['Bash', 'Python', 'Terraform'], project: 'Provision infrastructure with IaC', resource: 'DevOps learning paths' },
        { focus: 'CI/CD pipelines', skills: ['Build automation', 'Testing pipelines', 'Release flows'], tools: ['GitHub Actions', 'Jenkins', 'Docker'], project: 'Create a CI/CD workflow', resource: 'CI/CD docs' },
        { focus: 'Containers and orchestration', skills: ['Docker', 'Kubernetes', 'Service mesh'], tools: ['Docker', 'Kubernetes', 'Helm'], project: 'Deploy microservices to K8s', resource: 'Kubernetes docs' },
        { focus: 'Monitoring and reliability', skills: ['Metrics', 'Alerts', 'Logging'], tools: ['Prometheus', 'Grafana', 'ELK'], project: 'Build an observability stack', resource: 'Observability guides' },
        { focus: 'Security and operations', skills: ['Secrets management', 'Disaster recovery', 'Compliance'], tools: ['Vault', 'IAM', 'Backup tools'], project: 'Create a secure ops workflow', resource: 'SRE and DevOps resources' }
      ],
      'Cloud Architect': [
        { focus: 'Cloud architecture basics', skills: ['Architecture patterns', 'Network design', 'Storage selection'], tools: ['ArchiMate', 'Lucidchart', 'Terraform'], project: 'Design a cloud reference architecture', resource: 'Cloud architecture patterns' },
        { focus: 'Governance and security', skills: ['Identity management', 'Policy design', 'Compliance'], tools: ['AWS IAM', 'Azure Policy', 'GCP IAM'], project: 'Define secure cloud governance', resource: 'Provider architecture docs' },
        { focus: 'Resilience and scaling', skills: ['Fault domains', 'Auto recovery', 'Load balancing'], tools: ['Kubernetes', 'Cloud load balancers', 'CDN'], project: 'Architect a resilient application', resource: 'Resilient design resources' },
        { focus: 'Cost and operations', skills: ['Cost models', 'SLA design', 'Observability'], tools: ['Cloud Cost Explorer', 'Grafana', 'Terraform'], project: 'Build a cloud operations blueprint', resource: 'Cloud financial management guides' },
        { focus: 'Modern enterprise design', skills: ['Hybrid cloud', 'Microservices', 'Platform strategy'], tools: ['Terraform', 'Istio', 'Cloud APIs'], project: 'Create an enterprise cloud design package', resource: 'Architecture leadership materials' }
      ],
      'Mechanical Engineer': [
        { focus: 'Mechanical fundamentals', skills: ['Statics', 'Materials', 'CAD basics'], tools: ['SolidWorks', 'Fusion 360', 'MATLAB'], project: 'Design a mechanical bracket', resource: 'Mechanical design courses' },
        { focus: 'Machine elements', skills: ['Bearings', 'Gears', 'Fasteners'], tools: ['SolidWorks', 'ANSYS', 'Excel'], project: 'Model a gearbox assembly', resource: 'Machine design texts' },
        { focus: 'Thermodynamics & fluids', skills: ['Heat transfer', 'Fluid systems', 'Thermodynamic cycles'], tools: ['MATLAB', 'CFD basics', 'EES'], project: 'Analyze a heat exchanger', resource: 'Thermal engineering guides' },
        { focus: 'Manufacturing & prototyping', skills: ['CNC', '3D printing', 'Tolerancing'], tools: ['Fusion 360', '3D printers', 'CAM software'], project: 'Prototype a mechanical part', resource: 'Manufacturing resources' },
        { focus: 'System integration', skills: ['Mechanism design', 'Stress analysis', 'Product testing'], tools: ['ANSYS', 'Excel', 'CAD'], project: 'Build a complete mechanism', resource: 'Mechanical engineering case studies' }
      ],
      'Civil Engineer': [
        { focus: 'Civil engineering basics', skills: ['Statics', 'Materials testing', 'Surveying basics'], tools: ['AutoCAD', 'Civil 3D', 'Excel'], project: 'Design a simple structure', resource: 'Civil engineering textbooks' },
        { focus: 'Structural design', skills: ['Beams', 'Loads', 'Reinforced concrete'], tools: ['SAP2000', 'ETABS', 'AutoCAD'], project: 'Design a small frame', resource: 'Structural design guides' },
        { focus: 'Transportation and infrastructure', skills: ['Roadway design', 'Drainage', 'Site planning'], tools: ['Civil 3D', 'ArcGIS', 'Excel'], project: 'Draft basic infrastructure plan', resource: 'Civil planning resources' },
        { focus: 'Construction methods', skills: ['Project sequencing', 'Formwork', 'Safety'], tools: ['Revit', 'MS Project', 'Bluebeam'], project: 'Plan a construction sequence', resource: 'Construction management guides' },
        { focus: 'Sustainability', skills: ['Stormwater design', 'Materials selection', 'Resilience'], tools: ['LEED tools', 'GIS', 'BIM'], project: 'Design a resilient site plan', resource: 'Sustainable civil engineering resources' }
      ],
      'Electrical Engineer': [
        { focus: 'Electrical fundamentals', skills: ['Circuits', 'Signal analysis', 'Power basics'], tools: ['Multimeter', 'LTSpice', 'MATLAB'], project: 'Build a circuit simulator model', resource: 'Electrical engineering courses' },
        { focus: 'Electronics systems', skills: ['Analog design', 'Power electronics', 'PCB basics'], tools: ['KiCad', 'Oscilloscope', 'Altium'], project: 'Design a power supply circuit', resource: 'Electronics design guides' },
        { focus: 'Embedded control', skills: ['Microcontrollers', 'Sensors', 'Real-time control'], tools: ['Arduino', 'STM32', 'Proteus'], project: 'Build an embedded control system', resource: 'Embedded systems resources' },
        { focus: 'Power systems', skills: ['Distribution', 'Protective relays', 'Grid basics'], tools: ['ETAP', 'MATLAB', 'PowerWorld'], project: 'Analyze a distribution system', resource: 'Power system guides' },
        { focus: 'Signal processing', skills: ['Filters', 'Communications', 'DSP basics'], tools: ['MATLAB', 'Simulink', 'Python'], project: 'Implement a signal processing chain', resource: 'DSP learning resources' }
      ],
      'Electronics Engineer': [
        { focus: 'Circuit design basics', skills: ['Passive circuits', 'Semiconductors', 'PCB layout'], tools: ['KiCad', 'LTSpice', 'Oscilloscope'], project: 'Design a PCB module', resource: 'Electronics design courses' },
        { focus: 'Component selection', skills: ['Op-amps', 'Power components', 'Signal conditioning'], tools: ['Datasheets', 'LTSpice', 'Altium'], project: 'Build a signal conditioning stage', resource: 'Component design guides' },
        { focus: 'Embedded interfaces', skills: ['ADC/DAC', 'Sensor integration', 'Comm protocols'], tools: ['Arduino', 'Raspberry Pi', 'I2C/SPI modules'], project: 'Build a sensor acquisition board', resource: 'Embedded electronics tutorials' },
        { focus: 'System testing', skills: ['Measurement', 'Debugging', 'EMC basics'], tools: ['Oscilloscope', 'Logic Analyzer', 'Multimeter'], project: 'Test and validate an electronics board', resource: 'Electronics lab resources' },
        { focus: 'Power and reliability', skills: ['Power management', 'Thermal design', 'Quality control'], tools: ['SPICE', 'Thermal tools', 'DFM guides'], project: 'Design a reliable electronics module', resource: 'Advanced electronics resources' }
      ],
      'Robotics Engineer': [
        { focus: 'Robotics fundamentals', skills: ['Kinematics', 'Actuators', 'Sensors'], tools: ['ROS', 'Python', 'Gazebo'], project: 'Build a mobile robot prototype', resource: 'Robotics intro courses' },
        { focus: 'Control systems', skills: ['PID control', 'Motion planning', 'Feedback loops'], tools: ['MATLAB', 'ROS', 'Arduino'], project: 'Implement robot motion control', resource: 'Control systems guides' },
        { focus: 'Perception', skills: ['Sensor fusion', 'Camera systems', 'Lidar basics'], tools: ['OpenCV', 'ROS', 'Lidar SDKs'], project: 'Add perception to a robot', resource: 'Robotics perception resources' },
        { focus: 'Robot integration', skills: ['Mechanical integration', 'Power systems', 'Embedded software'], tools: ['ROS', 'SolidWorks', 'Embedded C'], project: 'Assemble a robot system', resource: 'Robotics engineering texts' },
        { focus: 'Automation workflows', skills: ['Autonomous navigation', 'Task planning', 'System testing'], tools: ['ROS', 'Gazebo', 'RViz'], project: 'Build an autonomous mission demo', resource: 'Advanced robotics tracks' }
      ],
      'Mechatronics Engineer': [
        { focus: 'Multidisciplinary basics', skills: ['Mechanics', 'Electronics', 'Control'], tools: ['SolidWorks', 'MATLAB', 'Arduino'], project: 'Create a mechatronics prototype', resource: 'Mechatronics foundations' },
        { focus: 'Embedded control', skills: ['Sensor integration', 'Actuators', 'Microcontrollers'], tools: ['Arduino', 'Raspberry Pi', 'C/C++'], project: 'Build a sensor-driven system', resource: 'Embedded systems tutorials' },
        { focus: 'System modeling', skills: ['Dynamics', 'Feedback loops', 'Simulation'], tools: ['Simulink', 'MATLAB', 'LabVIEW'], project: 'Model a mechatronic system', resource: 'System modeling guides' },
        { focus: 'Manufacturing and assembly', skills: ['CAD', 'Mechanism design', 'Electronics assembly'], tools: ['Fusion 360', 'KiCad', '3D printing'], project: 'Assemble a mechatronic device', resource: 'Prototyping resources' },
        { focus: 'Automation and testing', skills: ['Control tuning', 'Validation', 'Safety'], tools: ['PLC basics', 'NI tools', 'Python'], project: 'Validate an automated system', resource: 'Automation engineering guides' }
      ],
      'Automobile Engineer': [
        { focus: 'Automotive fundamentals', skills: ['Vehicle dynamics', 'Engine basics', 'Materials'], tools: ['CATIA', 'MATLAB', 'Excel'], project: 'Sketch a vehicle subsystem', resource: 'Automotive engineering texts' },
        { focus: 'Powertrain systems', skills: ['ICE basics', 'EV systems', 'Transmissions'], tools: ['Simulink', 'CAD', 'Excel'], project: 'Analyze a drivetrain', resource: 'Powertrain guides' },
        { focus: 'Control and electronics', skills: ['ECUs', 'Sensors', 'Embedded control'], tools: ['CAN tools', 'Arduino', 'MATLAB'], project: 'Prototype a vehicle control system', resource: 'Automotive electronics resources' },
        { focus: 'Manufacturing and testing', skills: ['Assembly processes', 'Quality control', 'Crash safety'], tools: ['CATIA', 'ANSYS', 'MS Project'], project: 'Plan a manufacturing flow', resource: 'Automotive manufacturing guides' },
        { focus: 'Electrification', skills: ['Battery systems', 'Charging systems', 'Thermal management'], tools: ['Simulink', 'Battery simulation', 'CAD'], project: 'Design an EV subsystem', resource: 'Electric vehicle resources' }
      ],
      'Biomedical Engineer': [
        { focus: 'Biomedical fundamentals', skills: ['Biomaterials', 'Anatomy basics', 'Signal acquisition'], tools: ['MATLAB', 'SolidWorks', 'LabVIEW'], project: 'Design a medical device concept', resource: 'Biomedical engineering courses' },
        { focus: 'Instrumentation', skills: ['Sensors', 'Signal processing', 'Data acquisition'], tools: ['DAQ systems', 'MATLAB', 'Python'], project: 'Build a biomedical measurement demo', resource: 'Instrumentation guides' },
        { focus: 'Regulatory & safety', skills: ['ISO standards', 'Risk analysis', 'Compliance basics'], tools: ['Excel', 'Documentation tools', 'FMEA templates'], project: 'Document device risk controls', resource: 'Medical device regulations' },
        { focus: 'Prototyping', skills: ['Mechanical design', 'Electronics integration', 'Testing'], tools: ['SolidWorks', 'PCB design', '3D printing'], project: 'Prototype a health monitoring device', resource: 'Biomedical prototyping guides' },
        { focus: 'Data-driven systems', skills: ['Bio-signal analysis', 'ML for health', 'Visualization'], tools: ['Python', 'TensorFlow', 'MATLAB'], project: 'Create a health signal analysis project', resource: 'Biomedical data science resources' }
      ],
      'Aerospace Engineer': [
        { focus: 'Aerospace foundations', skills: ['Aerodynamics', 'Materials', 'Flight mechanics'], tools: ['MATLAB', 'SolidWorks', 'ANSYS'], project: 'Model an airfoil', resource: 'Aerospace engineering courses' },
        { focus: 'Propulsion systems', skills: ['Fluid systems', 'Thrust', 'Thermodynamics'], tools: ['CFD basics', 'MATLAB', 'CATIA'], project: 'Analyze a propulsion subsystem', resource: 'Propulsion guides' },
        { focus: 'Avionics & control', skills: ['Flight control', 'Sensors', 'Navigation'], tools: ['Simulink', 'ROS', 'MATLAB'], project: 'Build a flight control simulation', resource: 'Avionics resources' },
        { focus: 'Structures & materials', skills: ['Stress analysis', 'Composite materials', 'Load paths'], tools: ['ANSYS', 'Nastran', 'AutoCAD'], project: 'Perform structural analysis', resource: 'Aerospace materials guides' },
        { focus: 'Systems integration', skills: ['Verification', 'Testing', 'Integration'], tools: ['DOORS', 'MATLAB', 'CAD'], project: 'Develop an aerospace systems concept', resource: 'Systems engineering guides' }
      ],
      'Chemical Engineer': [
        { focus: 'Process basics', skills: ['Mass balances', 'Reaction kinetics', 'Thermodynamics'], tools: ['MATLAB', 'Excel', 'Aspen Plus'], project: 'Model a chemical reactor', resource: 'Chemical engineering courses' },
        { focus: 'Process design', skills: ['Unit operations', 'Heat exchangers', 'Separation'], tools: ['Aspen Plus', 'MATLAB', 'CAD'], project: 'Design a process flow', resource: 'Process design guides' },
        { focus: 'Transport phenomena', skills: ['Fluid flow', 'Heat transfer', 'Mass transfer'], tools: ['COMSOL', 'MATLAB', 'ANSYS'], project: 'Analyze a transfer system', resource: 'Transport phenomena textbooks' },
        { focus: 'Safety & scale-up', skills: ['HAZOP', 'Plant safety', 'Scale-up'], tools: ['Process simulation', 'Excel', 'Safety tools'], project: 'Create a safe process design', resource: 'Chemical safety resources' },
        { focus: 'Process control', skills: ['PID control', 'Automation', 'Optimization'], tools: ['DCS emulators', 'MATLAB', 'Python'], project: 'Implement process control logic', resource: 'Advanced chemical engineering guides' }
      ],
      'Environmental Engineer': [
        { focus: 'Environmental systems', skills: ['Water treatment', 'Air quality', 'Waste management'], tools: ['GIS', 'Excel', 'AutoCAD'], project: 'Analyze a site remediation concept', resource: 'Environmental engineering resources' },
        { focus: 'Sustainability analytics', skills: ['Life cycle assessment', 'Emissions modeling', 'Regulations'], tools: ['SimaPro', 'Excel', 'GIS'], project: 'Assess environmental impact', resource: 'Sustainability guides' },
        { focus: 'Infrastructure design', skills: ['Stormwater design', 'Soil remediation', 'GIS'], tools: ['Civil 3D', 'GIS', 'MATLAB'], project: 'Design a remediation plan', resource: 'Environmental design resources' },
        { focus: 'Monitoring & compliance', skills: ['Sensor networks', 'Data collection', 'Reporting'], tools: ['GIS', 'Python', 'Excel'], project: 'Build an environmental monitoring prototype', resource: 'Compliance guides' },
        { focus: 'Climate resilience', skills: ['Resilient design', 'Adaptive planning', 'Sustainable systems'], tools: ['GIS', 'CAD', 'Python'], project: 'Create a resilience proposal', resource: 'Environmental sustainability resources' }
      ]
    };

    return templates[label] || null;
  }

  function renderError(message) {
    roadmapEl.innerHTML = `
      <div class="roadmap">
        <div class="empty-message">${escapeHtml(message)}</div>
      </div>
    `;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }
});
