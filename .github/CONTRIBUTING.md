## CONTRIBUTING

### Pull Requests

首先请参照：[Caicloud Review Conventions](https://github.com/caicloud/engineering/blob/master/docs/review_conventions.md) & [Caicloud Commit Conventions](https://github.com/caicloud/engineering/blob/master/docs/commit_conventions.md)

#### 遵循原则

1. **保持 master 最新并且稳定**
2. **一切皆可追溯的 PR**

#### 基于原则 1, 我们约定

- 未完成的 PR：merge 时不允许开放界面入口；影响 master 稳定的不允许 merge

- 涉及跨模块改动的 PR 必须经对应模块负责人 review

- PR 中不允许包含包括 mockdata 在内的影响实际运行的数据

#### 基于原则 2，我们约定

- 每个 PR 必须附上相关链接 (quality issue or kr issue)，做到每个 feat/bug issue 都可追溯相应 PR，反之亦然

- 每个 PR **专注** 做一件事，方便独立追溯

  - 最佳状态是单个 feat/bugfix 可独立 revert 而不影响其他模块

- 信息清晰也是可追溯的重要因素
  - PR title 请按规范，并追求简洁了然
    - 禁止出现类似 `fix some bugs` 含糊不清的
    - 尽量简洁；避免长篇大论，如 `fix(app): 使用 Table 替换了列表页 DataGrid 组件并 根据 UED 给的规范修改了应用列表页 loading 状态样式`
  - 涉及界面的 PR **必须**在 description 中附上截图
    - 最好标注修改前 & 修改后
    - 必要时可使用 gif 表示交互的变化

#### 合理拆分 PR or commit

##### 单个 feat 单个 PR 分多个 commit

如单人开发某个模块时，只需提交一个 PR，分阶段追加多个 commit，待 feat 完成时 PR 即合入；
在此过程中需注意：

- PR 未完成时 title 改为 `WIP:feat:xxx` 或者 comment `/hold` (Work In Progress)
- 不允许 `commit --amend`，不然 reviewer 看不出来改了什么
- commit 应该及时提出，避免一次提交多个或者代码量大的 commit，分多次 review

##### 单个 feat 分多个 PR

涉及多人协作开发同一模块时，PR 需要及时 merge，此时可分为多个 PR 提交，但仍应保证专注。

e.g. 详情页可拆分为框架布局 + 多个 Tab，那么基础布局可作为一个独立 PR 合入，待基础布局 merge 后，每人分工不同 Tab 可各自提 PR。（此时每个 Tab 的 PR 应在完成之后合入）

---

#### Appendix

**maybe you need**

- [bot-commands](https://github.com/caicloud/engineering/blob/master/docs/caicloud_bot.md#bot-commands): 处理 issue & pr 都通过命令
- [github-flow](https://github.com/caicloud/engineering/blob/master/docs/github.md)
