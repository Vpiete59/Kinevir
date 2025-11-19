(function() {
  'use strict';

  const KinevirWidget = {
    config: {
      baseUrl: 'https://app.kinevir.com',
      widgetPath: '/widget/appointment'
    },

    init: function(options = {}) {
      const containerId = options.containerId || 'kinevir-widget';
      const width = options.width || '100%';
      const height = options.height || '800px';

      const container = document.getElementById(containerId);
      if (!container) {
        console.error('Kinevir Widget: Container element not found');
        return;
      }

      const iframe = document.createElement('iframe');
      iframe.src = this.config.baseUrl + this.config.widgetPath;
      iframe.style.width = width;
      iframe.style.height = height;
      iframe.style.border = 'none';
      iframe.style.borderRadius = '8px';
      iframe.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
      iframe.setAttribute('allowtransparency', 'true');
      iframe.setAttribute('title', 'Widget de prise de rendez-vous Kinevir');

      container.appendChild(iframe);

      window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'KINEVIR_APPOINTMENT_SELECTED') {
          if (options.onAppointmentSelected) {
            options.onAppointmentSelected(event.data.data);
          }

          if (options.redirectUrl) {
            const appointmentData = encodeURIComponent(JSON.stringify(event.data.data));
            window.location.href = options.redirectUrl + '?appointment=' + appointmentData;
          }
        }
      });

      return iframe;
    }
  };

  if (typeof window !== 'undefined') {
    window.KinevirWidget = KinevirWidget;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = KinevirWidget;
  }
})();
