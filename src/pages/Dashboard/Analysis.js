import React, { Component } from 'react';
import _ from 'lodash';

const COLOR_MAP = [
  '#FF0066',
  '#00CC00',
  '#FFCC00',
  '#FF99FF',
]

class Analysis extends Component {
  state = {
    num: 4, // 参与人数
    data_list: [] // [x, y, 右侧是否还有结点]
  };

  componentWillMount() {
    this.elm = null;
  }

  componentDidMount() {
    let context = this.createCanvas();
    this.createLine(context);

  }

  // 创建基础画布
  createCanvas() {
    let {
      state: {
        num
      }
    } = this;

    let context = this.elm.getContext("2d");
    const width = (num + 1) * 100;
    const height = (num + 1) * 125;
    context.rect(0, 0, width, height);
    context.fillStyle = "#f2f2f2";
    context.fill();
    context.strokeStyle = COLOR_MAP[0];
    context.lineJoin = "round";
    context.lineWidth = 5;
    context.beginPath();
    return context;
    }

  // 生成画布大小
  countXY() {
    let {
      state: {
        num
      }
    } = this;

    return {
      width: (num + 1) * 100,
      height: (num + 1) * 125
    }
  }

  // 竖线
  createLine(context) {
    let {
      state: {
        num
      }
    } = this;
    const size = this.countXY();
    const beg_x = size.width / (num+1); // 初始x坐标
    let data_list = [];

    // 等分画数线
    for (let i = 0; i < num; i++) {
      let x = beg_x * (i+1);
      context.moveTo(x, 0);
      context.lineTo(x, size.height);
      if ((num - 1) != i) {
        data_list.push(this.createHorizontalLine(context, x, i));
      }
    }

    this.setState({
      data_list
    }, () => {
      this.filterData();
    });

    context.stroke();
  }

  /*
     @params context={object}, x={int}(横线起始位置), index={int}(当前坐标)
     @detail 画横线
   */
  createHorizontalLine(context, x, index) {
    let {
      state: {
        num
      }
    } = this;

    const node_list = [];
    const size = this.countXY();
    const max = num; // 横线数量上限
    let number = _.random(1, max);
    let line_width = size.width / (num + 1);
    let _h = size.height / 2 / number;
    let postion = index * 50; // 偏移量

    for (let i = 1; i <= number; i++) {
      let y = (_h * i / number + postion);
      context.moveTo(x, y);
      context.lineTo(x + line_width, y);
      node_list.push([x, Math.floor(y), true]); // [x, y, 右侧是否还有结点]
    }
    context.stroke();
    return node_list;
  }

  // 查找绘制路径
  findPath(data, index, step = 0, result = []) {
    console.log('debug 123: ' ,this.state.data_list);
    const len = data[index].length;
    let item = null;

    if (step == 0) {
      item = data[index][step];
      result.push([item[0], 0]);
      step++;
      return this.findPath(data, index, step, result);
    }
    // 第N个
    if ((len - 1) > step) {
      item = data[index][step];
      result.push([item[0], item[1]]);
      if (item[2]) {
        let _index = this.findIndex(data[index+1], item[1]); // 下一列 y=item[1]
        return this.findPath(data, index+1, _index, result);
      }

    }
    else {
      // console.log(result, 'resultresultresultresultresultresultresult');
    }

  }

  // 查找当前结点在数组内下标
  findIndex(data, y) {
    let index = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i][1] == y) {
        index = i;
      }
    }
    return index;
  }


  // 标记数据并排序
  filterData() {
    let {
      state: {
        data_list
      }
    } = this;
    let data = _.cloneDeep(data_list);
    let len = data.length;

    for (let i = 0; i < len; i++) {
      for (let j = 0; j < data[i].length; j++) {
        let y = data[i][j][1];
        if (i != len-1 && data[i][j][2]) {
          data[i+1].push([data[i+1][0][0], y, false])
        }
      }
    }
    data = data.map(item => {
      return item.sort((a, b) => (a[1] - b[1]));
    })
    this.setState({
      data_list: data
    }, () => {
      console.log('数据过滤 done!');
      this.findPath(this.state.data_list, 0);
    });
  }


  render() {
    return (
      <div>
        画鬼脚
        <canvas
          ref={n => this.elm = n}
          width={500}
          height={666}
        />
      </div>
    )
  }
}

export default Analysis;
