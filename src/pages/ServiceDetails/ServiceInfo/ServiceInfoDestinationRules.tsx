import * as React from 'react';
import { DestinationRule, EditorLink, Subset } from '../../../types/ServiceInfo';
import { Col, Row, Table } from 'patternfly-react';
import * as resolve from 'table-resolver';
import LocalTime from '../../../components/Time/LocalTime';
import Label from '../../../components/Label/Label';
import DetailObject from '../../../components/Details/DetailObject';
import { Link } from 'react-router-dom';

interface ServiceInfoDestinationRulesProps extends EditorLink {
  destinationRules?: DestinationRule[];
}

class ServiceInfoDestinationRules extends React.Component<ServiceInfoDestinationRulesProps> {
  constructor(props: ServiceInfoDestinationRulesProps) {
    super(props);
  }

  headerFormat = (label, { column }) => <Table.Heading className={column.property}>{label}</Table.Heading>;
  cellFormat = (value, { column }) => {
    const props = column.cell.props;
    const className = props ? props.align : '';

    return <Table.Cell className={className}>{value}</Table.Cell>;
  };

  columns() {
    return {
      columns: [
        {
          property: 'name',
          header: {
            label: 'Name',
            formatters: [this.headerFormat]
          },
          cell: {
            formatters: [this.cellFormat]
          }
        },
        {
          property: 'trafficPolicy',
          header: {
            label: 'Traffic Policy',
            formatters: [this.headerFormat]
          },
          cell: {
            formatters: [this.cellFormat]
          }
        },
        {
          property: 'subsets',
          header: {
            label: 'Subsets',
            formatters: [this.headerFormat]
          },
          cell: {
            formatters: [this.cellFormat]
          }
        },
        {
          property: 'host',
          header: {
            label: 'Host',
            formatters: [this.headerFormat]
          },
          cell: {
            formatters: [this.cellFormat]
          }
        },
        {
          property: 'createdAt',
          header: {
            label: 'Created at',
            formatters: [this.headerFormat]
          },
          cell: {
            formatters: [this.cellFormat]
          }
        },
        {
          property: 'resourceVersion',
          header: {
            label: 'Resource version',
            formatters: [this.headerFormat]
          },
          cell: {
            formatters: [this.cellFormat]
          }
        },
        {
          property: 'actions',
          header: {
            label: 'Actions',
            formatters: [this.headerFormat]
          },
          cell: {
            formatters: [this.cellFormat]
          }
        }
      ]
    };
  }

  yamlLink(destinationRule: DestinationRule) {
    return (
      <Link to={this.props.editorLink + '?destinationrule=' + destinationRule.name + '&detail=yaml'}>View YAML</Link>
    );
  }

  rows() {
    return (this.props.destinationRules || []).map((destinationRule, vsIdx) => ({
      id: vsIdx,
      name: destinationRule.name,
      trafficPolicy: destinationRule.trafficPolicy ? (
        <DetailObject name="" detail={destinationRule.trafficPolicy} />
      ) : (
        'None'
      ),
      subsets:
        destinationRule.subsets && destinationRule.subsets.length > 0
          ? this.generateSubsets(destinationRule.subsets)
          : 'None',
      host: destinationRule.host ? <DetailObject name="" detail={destinationRule.host} /> : undefined,
      createdAt: <LocalTime time={destinationRule.createdAt} />,
      resourceVersion: destinationRule.resourceVersion,
      actions: this.yamlLink(destinationRule)
    }));
  }

  generateKey() {
    return (
      'key_' +
      Math.random()
        .toString(36)
        .substr(2, 9)
    );
  }

  generateSubsets(subsets: Subset[]) {
    let childrenList: any = [];
    subsets.map(subset => {
      Object.keys(subset.labels).forEach((key, v) =>
        childrenList.push(
          <li key={this.generateKey() + '_k' + v}>
            <span style={{ float: 'left', paddingRight: '10px', paddingTop: '3px' }}>{subset.name}</span>{' '}
            <Label name={key} value={subset.labels[key]} />
            <DetailObject name="trafficPolicy" detail={subset.trafficPolicy} />
          </li>
        )
      );
    });
    return <ul style={{ listStyleType: 'none', float: 'left' }}>{childrenList}</ul>;
  }

  renderTable() {
    return (
      <Table.PfProvider columns={this.columns().columns} striped={true} bordered={true} hover={true} dataTable={true}>
        <Table.Header headerRows={resolve.headerRows(this.columns())} />
        <Table.Body rows={this.rows()} rowKey="id" />
      </Table.PfProvider>
    );
  }

  render() {
    return (
      <Row className="card-pf-body">
        <Col xs={12}>{this.renderTable()}</Col>
      </Row>
    );
  }
}

export default ServiceInfoDestinationRules;
