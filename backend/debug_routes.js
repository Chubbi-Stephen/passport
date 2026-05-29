const express = require('express');
const studentRoutes = require('./routes/student');
const app = express();

app.use('/api/student', studentRoutes);

function listRoutes(stack, prefix = '') {
  stack.forEach(r => {
    if (r.route && r.route.path) {
      const methods = Object.keys(r.route.methods).join(',').toUpperCase();
      console.log(`${methods} ${prefix}${r.route.path}`);
    } else if (r.name === 'router' && r.handle.stack) {
      listRoutes(r.handle.stack, prefix + (r.regexp.source.replace('\\/?(?=\\/|$)', '').replace('^\\/', '').replace(/\\\//g, '/').replace('\\?', '')));
    }
  });
}

console.log('--- REGISTERED STUDENT ROUTES ---');
listRoutes(app._router.stack);
process.exit();
