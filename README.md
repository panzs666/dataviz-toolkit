# DataViz Toolkit

A modern JavaScript library for creating interactive data visualizations.

## Features

- Interactive charts and graphs
- Real-time data updates
- Customizable themes
- Responsive design
- Easy integration with popular frameworks

## Installation

```bash
npm install dataviz-toolkit
```

## Quick Start

```javascript
import { Chart } from 'dataviz-toolkit';

const chart = new Chart('#chart-container', {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      label: 'Sales',
      data: [12, 19, 3, 5, 2]
    }]
  }
});
```

## Documentation

Full documentation is available at [docs.dataviz-toolkit.dev](https://docs.dataviz-toolkit.dev)

## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

MIT License - see [LICENSE](LICENSE) file for details.