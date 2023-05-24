const userFlowNode = [
  {
    id: "user1_1",
    nodes: [
      {
        id: "1",
        time: "1",
        name: "SVM",
        value: `<h1><br></h1><h2>search</h2><ul><li>DFS</li></ul><pre class="ql-syntax" spellcheck="false">DFS(node u){
  	visited[u] = true;
  	for each v in (u, v):
  		if visited[v] == false:
  			DFS(v);
  }
  </pre><ul><li>BFS</li></ul><pre class="ql-syntax" spellcheck="false">BFS(node s){
  	q.enqueue(s);
  	visited[s] = true;

  	while(!q.isEmpty()){
  		u = q.dequeue()
  		for each v in (u, v){
  			if (visited[v] == false){
  				q.enqueue(v);
  				visited[v] = true;
  		}
  	}
  }

  </pre><h2>Minimal cost spanning tree</h2><ul><li>Kruskal</li></ul><ol><li class="ql-indent-1">將edges由小到大排序。(可以 min heap 實作)。 → O(e log e)</li><li class="ql-indent-1">建立兩個集合 T, E。開始時T為empty、E為所有edges 的集合。</li><li class="ql-indent-1">每回合由E pop weight 最小的edge，若不會產生cycle 則將此edge 加入T中。</li></ol><ul><li>→ 判斷是否存在cycle 使用dinsjoint set 演算法: O(e log e)</li></ul><ol><li class="ql-indent-1">進行至 T 有 n-1個 edge、或E為空時停止。</li></ol><ul><li class="ql-indent-1">Greedy</li><li>Prim</li></ul><ol><li class="ql-indent-1">選擇一起始 node: s。</li><li class="ql-indent-1">建立三個個集合U = {s}, V = set of all vertices, T = {}。</li><li class="ql-indent-1">每回合找出 weight 最小的 edge e = (u, v)，where u in U and v in V。</li><li class="ql-indent-1">將e加入T，並將 v 加入U。</li><li class="ql-indent-1">當 U = V 時停止。</li></ol><ul><li>Sollin</li><li>將每個 vertice 都視為一個 tree。每回合選擇與其他 tree 連接的 minimun cost edge合併。</li><li>進行到 tree 的總數剩下一顆為止。</li><li>    time Complexity 說明(皆使用 adj list 實作)     Kruskal O(e log e) + O(e log e) = O(e log e) 排序: O(e log e), 檢查迴圈: O(e log e)   Prim O(E + V log V) 使用 binary heap: O(e log v) 使用 Fibbonacci heap: O(e + V log V)   Sollin O(e log v) 每經過一回合 tree 的數量減半: O(v log v) 每回合要從 e 個邊選出最小: e   如為directed graph, |E| 有可能大於 |V|，故|E| 為|V| 的upperbound.</li><li>disjoint set 方式判斷是否存在cycle。</li><li class="ql-indent-1">原先有 |v| 個集合，每個集合內為每個頂點v，且集合的root為該頂點v。</li><li class="ql-indent-1">當要判斷(u, v) 是否形成cycle，找出u, v 所在集合的root, 若u.root ≠ v.root 則合併兩集合，且新集合之root 可為u, v其中一個set的root。</li><li class="ql-indent-1">若 u.root == v.root 則代表形成cycle。</li></ul><h3>重要觀念</h3><ol><li>若圖形的V &gt;&gt; E, e.g. sparse graph, 使用 kruskal 為佳。</li><li>證明: 任兩點間的 minimum cost edge 必屬於 minimum cost spanning tree。</li></ol><ul><li>pf:</li><li class="ql-indent-1">if <strong>e</strong> = minimum cost edge of (u, v) not in the minimum cost spanning tree <strong>MST</strong>, then adding <strong>e</strong> to <strong>MST</strong> must form a cycle. and there must be another edge <strong>e’</strong> connect u, v who’s cost &gt; <strong>e</strong>. By replacing <strong>e’</strong> with <strong>e</strong>, we get another <strong>MST’</strong> where <strong>cost(MST’) &lt; cost(MST)</strong>, so <strong>MST</strong> is not a minimum cost spanning tree, contradiction!</li></ul><ol><li>證明: The edge of second smallest weight must be in a minimum cost spanning tree.</li></ol><ul><li>pf:</li><li>if minimum cost spanning tree = MST(G), second smallest edge = e.</li><li class="ql-indent-1">then MST(G) U e must form a cycle. a cycle has at least three edges(cycle must be a simple path), so there must exist another edge e’ whose cost &gt; e. By replacing e’ with e we get another MST’(G) whose cost &lt; MST, so MST is not a minimum cost spanning tree, contradiciton!</li></ul><h2>最短路徑</h2><ul><li>Dijkstra - single source</li><li>S = {}, V = {set of all nodes}, dist[], pred[]</li></ul><ol><li class="ql-indent-1">由 V-S 中選擇 dist 最小的node v 加入S. (第一輪為起點)</li><li class="ql-indent-1">所有的 (v, w) 中如果 w not in S, 執行relaxation</li><li class="ql-indent-1">relaxation : if dist[w] &gt; dist[v] + (v, w), dist[w] = dist[v] + (v, w)</li><li class="ql-indent-1">反覆執行至|S| = |V|</li></ol><ul><li class="ql-indent-1">dist 紀錄每個 node 相對於起點的距離。</li><li class="ql-indent-1">pred 可以trace 由起點至某一節點的路徑。</li><li>Bellman-Ford - single source</li><li class="ql-indent-1">由一起點開始</li><li class="ql-indent-1">執行 |v-1| 次，每回合對所有edge (u, v) 執行 relaxation.</li><li class="ql-indent-1">relaxation: if dist[v] &gt; dist[u] + cost[u, v], dist[u] = dist[u] + cost[u, v]</li><li class="ql-indent-1">Time Complexity = O(|v-1| * e)</li><li>需要在最後執行:</li><li>for each edge (u, v):</li><li>if dist[v] &gt; dist[u] + cost[u, v] :</li><li>print “negative cycle found!” and break</li><li>Floyd-Warshall - All pair</li><li class="ql-indent-1">執行 k 回合，(k = 1 ~ number of vertice), k 作為中繼點，建立矩陣 A_k</li><li class="ql-indent-1">A_0 = 原先的adjacency matrix</li><li class="ql-indent-1">每回合計算 $A_{k}[i, j] = min(A_{k-1}[i, j], A_{k-1}[i,k] + A_{k-1}[k,j])$</li><li>Johnson</li></ul><h1><br></h1>`,
      },
      {
        id: "2",
        time: "1",
        name: "Linear",
        value: `<h2>1. 迴歸模型在做什麼事？</h2><p>這邊有一個我捏造的數據集，如圖一，x軸為每個月的學習時數，y軸為薪水，而這些數據點為數據集中的每一筆數據資料，而經過迴歸模型訓練運算後，我們會找到一條如圖二的線，它像是從這些數據點位置的中間穿了過去的線，<strong>透過計算出這條迴歸模型線的方程式，我們就能預測新的數據點，舉例像是今天來了一個新的人（新數據點），我們得知他的學習時數（自變數），就能夠預測他可能的薪水（應變數）</strong></p><p><br></p><p>圖一：數據集</p><p><img src="https://miro.medium.com/v2/resize:fit:814/0*gtUEdQZoah3zYrgm.png"></p><p>圖二：迴歸模型與數據集的關聯</p><p><img src="https://miro.medium.com/v2/resize:fit:814/0*92_WT_Iy_87R7qIV.png"></p><p><strong>小提醒： 圖二大家可能有疑問說為什麼數據比較少，我會在下一篇的實作教學中跟大家講解XD，其實簡單來說，就是這邊是訓練集的模型預測結果視覺化圖</strong></p><h2>2. 我們如何計算出這條線的方程式呢？</h2><p><strong>透過最小平方法來計算並建構出迴歸模型</strong>，計算出一條方程式，視覺化出一條迴歸線，使這條迴歸線與所有的數據點的距離並不會相差太多，也就是在有同樣的X軸值下，y軸值不會相差太多，也就是實際點與線的距離誤差不會太大，根據我們的數據簡單來說，就是在同一學習時間值（自變數）下，預測出的薪水（應變數）不會誤差太多</p><p><br></p><h2>3. 如何找到最佳的線方程式？</h2><p>實際數據點（值）與這條迴歸模型線相切的點就為迴歸模型的預測值，如圖三，這條相切的直線就是它與實際點的距離差，也就是預測值與實際值的誤差，加總這些實際點與預測點的誤差的平方，就能計算出成本函數（Cost Function），或稱損失函數（Loss Function），如圖四的公式，並且想辦法讓成本函數最小化，就能找到最佳的一條迴歸模型方程式喔</p><p><br></p><p><strong>圖三：</strong>&nbsp;為了方便講解，圖是以簡單線性迴歸（Simple Linear Regression）為例子喔，所以方程式才會只有這樣，線也才會只有直的XD</p><p><img src="https://miro.medium.com/v2/resize:fit:1400/0*glS1HMndhd0mJeDJ.png"></p><p><strong>圖四：</strong>&nbsp;我們會利用最小平方法來計算出那條迴歸模型線，而這些點與線的距離和，就是誤差和，算法就稱為成本函數（Cost Function），或稱損失函數（Loss Function）</p><p><img src="https://miro.medium.com/v2/resize:fit:848/0*DKm-ybZ07ZYTVnGa.png"></p><p><strong>補充 圖五：</strong>是我根據網路上找到的資料重新繪製的視覺圖，它清楚的呈現了如何計算出迴歸方程式的方法，跟我上面的成本函數公式有一點點的不同，為了方便與大家講解，所以我踩用了我在看教學文章中，最好理解的公式，如圖四</p><p><img src="https://miro.medium.com/v2/resize:fit:1400/0*yCKAaxJLVsoLEjZu.png"></p><h2>4. 如何最小化（Minimize）成本函數（Cost Function）?</h2><p><strong>使用梯度下降（Gradient Descent）!!</strong></p><p><br></p><p>要最小化成本函數（Cost Function），也就是讓實際點與迴歸模型上的預測值誤差最小化，而影響這條迴歸模型線有一個重要的因子，就是斜率，所以我們需要計算出這條迴歸線的截距與斜率，也就是找到如圖三的W0與W1，也就是計算出權重值，而簡單的線性迴歸，可以使用聯立方程式求解或線性方程式解（Normal Equation）來找最佳解，但現實中有相當多種的迴歸模型，也就有相當多種複雜的方程式，我們就不可能都用上述兩種方法，來計算複雜的方程式，這時就需要梯度下降（Gradient Descent）的方法來協助我們，以最快速的方法找到最佳解（極值）</p><h2>5. 梯度下降（Gradient Descent）方法是如何運作的？</h2><p>梯度下降（Gradient Descent）最有名的解釋方式，就是爬山的故事，想像一下我們人在玉山的山頂，並且思考著要如何最快回到山底呢，總不能直接跳下去吧，那太陡了XD，而我們就要挑選很陡的坡來走，才能最快下山，而這個陡坡的傾斜程度，就是利用成本函數進行微分得來的，而乘上的α係數，就是學習率（Learning Rate），代表著我們走一步的距離，但是設定α係數千萬不要覺得越大越好，太小會很慢才到山底，而太大一開始確實會幫助我們下降很快，但因為每一步的距離太大，會讓我們過頭，想像一下有一個U型谷，每移動一次我們就要找尋最佳切線（傾斜程度），然後移動一步距離（α係數），如果移動太大就會超過山底，很難剛好走到山底的位置，也就很難找到極值（最佳解）</p><p><br></p><p><strong>梯度下降（Gradient Descent）：根據對成本函數（Cost Function）進行運算處理，並計算出新權重值（極值）的公式</strong></p><p><img src="https://miro.medium.com/v2/resize:fit:1330/0*2jQ9ZC_Mfg8xsm4H.png"></p><p><strong>公式講解： 對成本函數進行微分（Cost Function），並乘上學習率（alpha），並拿上一次更新的權重值減掉它，成為新的權重值（極值）</strong></p><p><strong>疑問：為什麼是用上一次計算出來的權重值減微分後乘以α係數（學習率）的成本函數（Cost Function），成為新的權重值呢？為什麼不是用加？簡單來說，想像一下，因為我們要不斷逼近山底，也就是方向是往切線的下方走，所以是用減的喔</strong></p><p><strong>重點整理</strong></p><p>我們要最快下山，也就是要以最快的方式找到極值，取決於選擇路線的陡峭程度與每一步距離</p><ul><li>陡峭程度（切線斜率）： 對成本函數（Cost Function）進行微分</li><li>每一步的距離： α係數，也就是學習率（Learning Rate）</li><li>α係數設定太小，走太慢（找尋極值太慢），設定太大，一步距離太大，很難剛好走到山底，這就是所謂的震盪</li></ul><p><br></p><h1>補充：梯度下降（Gradient Descent）方法有哪些 與 它們在找尋權重值（極值）的公式差別</h1><ol><li><strong>Batch Gradient Descent (批量梯度下降法)：</strong></li></ol><p><br></p><ul><li>以簡單線性迴歸為例，就是每次運算新權重值時，也就是調整產生新的w0與w1時，都會計算到所有的數據點（樣本）</li><li>優點：精確度（Accuracy）很高</li><li>缺點：計算成本龐大</li></ul><p><strong>2. Stochastic Gradient Descent (隨機梯度下降法)：</strong></p><ul><li>以簡單線性迴歸為例，就是每次運算出新的權重值時，也就是調整w0與w1時，只會計算一個數據點（樣本）</li><li>優點：計算成本非常低</li><li>缺點：精確度（Accuracy）沒有那麼高</li></ul><p><strong>3. Mini-Batch Gradient Descent</strong></p><ul><li>綜合前面兩個梯度下降方法，以一些樣本來計算，並調整新的權重值</li></ul><p><br></p><p><strong>小筆記：簡單來說，就是Batch Gradient Descent每次計算並調整新的權重值時，都需要動用所有的數據集樣本，而Stochastic Gradient Descent只動用一個數據集樣本，而Mini-Batch Gradient Descent，則綜合兩者以一些樣本來計算調整</strong></p><p>詳細的梯度下降（Gradient Descent）方法，我會在之後學習，並分享給大家學習</p><h1>補充：線性方程式解（Normal Equation）與梯度下降（Gradient Descent）方法，找尋最小化（Minimize）成本函數（Cost Function）的步驟</h1><ol><li><strong>線性方程式解（Normal Equation）步驟</strong></li></ol><p><br></p><p>Step1: 定義成本函數（Cost Function）</p><p>Step2: 對成本函數（Cost Function）微分求極值，也就是我們要的權重值（補充：方程式進行微分的時候，在零的點上，可以找到最大或最小值，也就是極值）</p><p>Step3: 找到權重值</p><p><strong>2. 梯度下降（Gradient Descent）步驟</strong></p><p>Step1: 隨機初始化權重值，也就是先隨機找值當權重值</p><p>Step2: 利用微分成本函數（Cost Function）的方式，沿梯度相反方向下降求極值，並根據學習率大小（α係數，Learning Rate），調整下降一步距離</p><p>Step3: 重複Step2，直到找到最小化的成本函數（Cost Function）</p><p>Step4: 計算並找到權重值</p><h1>迴歸模型種類與公式</h1><p>簡單來說，迴歸模型是用來瞭解自變數與應變數之間的關係，縱而未來有新樣本加入數據集時，我們有它的特徵（自變量），就能預測它應變量的值，而根據每個數據集的特徵維度不同，也會有不同計算方法的迴歸模型，大致可以分成以下幾種迴歸模型：</p><p><br></p><h2>1. 簡單線性迴歸（Simple Linear Regression）</h2><ul><li>說明：就是我們這篇一直使用的範例圖（如圖二），所計算並繪製出一條直的迴歸線，它代表著特徵（自變數）與目標（應變數）之間的關聯</li><li>使用時機：特徵（自變數）與目標（應變數）的關係呈線性關聯</li><li>公式：</li></ul><p><img src="https://miro.medium.com/v2/resize:fit:278/0*W4VfzqtDga13eKgD.png"></p><h2>2. 多項式迴歸（Polynomial Regression）</h2><ul><li>說明：簡單線性迴歸（Simple Linear Regression）只能找出線性的關聯，但有些數據並非線性的，就要使用能夠計算非線性的高維度多項式迴歸（Polynomial Regression）模型</li><li>使用時機：特徵（自變數）與目標（應變數）的關係呈現非線性</li><li>公式</li></ul><p><img src="https://miro.medium.com/v2/resize:fit:524/0*iQ56CQtp-x9FF81q.png"></p><h2>3. 多元迴歸（Multivariable Regression）</h2><ul><li>．說明：數據集的特徵通常不只一個，多特徵同時影響目標的情況，也就是多個自變數同時影響應變數的情形，就適合使用多元迴歸（Multivariable Regression）來建立模型</li><li>．使用時機：特徵數量（自變數）多，且對目標（應變數）都有影響的時候</li><li>．公式</li></ul><p><img src="https://miro.medium.com/v2/resize:fit:498/0*Dcj443C0dl6kSKmh.png"></p><h1>建構迴歸模型可能遇到的問題？ 過度擬和與低度擬和</h1><p>選擇參數數量是一門藝術，非常重要！！數據集中的特徵數量的選擇也非常重要，總不能所選的特徵比樣本數量還要多吧，像是我要收集很多人的特徵（身高、體重、三圍等等）來預測薪水，但我的數據集只收集了兩個人（樣本）的特徵資料</p><p><br></p><p><strong>低度擬和</strong></p><ul><li>訓練出來的迴歸模型，沒辦法描述數據集資料，也就是沒辦法解釋問題的複雜度，使得整個預測效果很不好</li><li>當選擇的參數太少，以至於迴歸模型的預測效果相當不好</li><li>舉例來說，就是實際狀況下影響應變數（果）的自變數（因）有很多種，應該要用多項式迴歸模型來計算，但我們卻用只用一個自變數來預測應變數的簡單線性迴歸模型，來計算，導致敬效果不彰</li></ul><p><strong>過度擬和</strong></p><ul><li>訓練出來的迴歸模型，過度地解釋問題的複雜度，導致過度的符合這次的訓練集資料，這樣有新的樣本加入後，預測的效果並不好</li><li>當選擇的參數過多，以至於迴歸模型在預測這次訓練模型用的數據集，表現的效果相當精準，但實際去預測新的數據時，準確率卻突然不高了</li></ul><p><br></p><p><img src="https://miro.medium.com/v2/resize:fit:1400/0*00L_xyaOb0Udilxh.png"></p><p>圖片來源：<a href="http://yltang.net/tutorial/dsml/13/" rel="noopener noreferrer" target="_blank" style="color: inherit;">http://yltang.net/tutorial/dsml/13/</a></p><h1>如何降低過度擬和？</h1><p>過度擬和的問題來自於我們選擇的特徵數量太多，造成明明是類似的特徵，但因為都被我們拿來當自變數訓練迴歸模型，導致有了加成的效果，也就是所謂的特徵共線性問題，舉例來說，我們想預測國中生中未來會考上第一志願的機率，我們拿了許多的特徵來訓練模型，像是是否資優班、數學分數、考試平均分數等，來進行預測，但只要他是資優班，他的數學分數就容易是高的，而他的考試平均當然也有很大的機率是高的，它們三種特徵明明就具有關聯性，卻被當不同的特徵來訓練，這樣就很容易造成所謂的特徵共線性問題，導致三個特徵的加成加重了效果，影響了最後成果的模型預測能力</p><p><br></p><ul><li><strong>解決方法 提供一個懲罰機制，來降低用以訓練模型的特徵使用量，以降低過度擬和的問題，這樣的方法稱為正規化，如下述兩個方法：</strong></li></ul><p><br></p><h2>1. Lasso Regression (L1)</h2><ul><li>說明：我們讓成本函數加上懲罰項，並且要盡可能的最小化這個加起來的值（如下公式），但大家也看到了，如果我們加入越多的特徵（n），也就是將權重值取絕對值相加，右邊的懲罰項就會越大，就很難最小化，藉此來控制特徵的使用量不可以太多</li><li>公式</li></ul><p><br></p><p><img src="https://miro.medium.com/v2/resize:fit:500/0*49ANal_WOPnoPoLb.png"></p><h2>2. Ridge Regression (L2)</h2><ul><li>說明：我們讓成本函數加上懲罰項，並且要盡可能的最小化這個加起來的值（如下公式），但大家也看到了，如果我們加入越多的特徵（n），也就是將權重值平方相加，右邊的懲罰項就也會越大，就很難最小化，藉此來控制特徵的使用量不可以太多</li><li>公式</li></ul><p><br></p><p><img src="https://miro.medium.com/v2/resize:fit:430/0*EIOJtFqXp1xjVyXe.png"></p><p><strong>小補充：大家在網路上或書上，可能會看到損失函數（Loss Function）這個詞，然後可能會納悶說我這篇怎麼沒有提到，所以這邊要特別跟大家報告一下，我這篇使用的成本函數（Cost Function）等同於損失函數（Loss Function）喔</strong></p><p>更詳細的迴歸模型教學與介紹，可以參考Sckit-Learn的官網（<a href="https://scikit-learn.org/stable/modules/linear_model.html#%EF%BC%89%E5%96%94" rel="noopener noreferrer" target="_blank" style="color: inherit;">https://scikit-learn.org/stable/modules/linear_model.html#）喔</a></p><h1>Reference</h1><p><a href="https://pyecontech.com/2019/12/28/python-%E5%AF%A6%E4%BD%9C-%E8%BF%B4%E6%AD%B8%E6%A8%A1%E5%9E%8B/" rel="noopener noreferrer" target="_blank" style="color: inherit;">https://pyecontech.com/2019/12/28/python-實作-迴歸模型/</a></p><p><br></p><p><a href="https://sckit-learn.org/stable/modules/linear_model.html#" rel="noopener noreferrer" target="_blank" style="color: inherit;">https://sckit-learn.org/stable/modules/linear_model.html#</a></p><p><a href="https://yltang.net/tutorial/dsml/13/" rel="noopener noreferrer" target="_blank" style="color: inherit;">https://yltang.net/tutorial/dsml/13/</a></p><p><a href="https://kknews.cc/zh-tw/tech/4kkoqog.html" rel="noopener noreferrer" target="_blank" style="color: inherit;">https://kknews.cc/zh-tw/tech/4kkoqog.html</a></p><p><a href="https://www.itread01.com/content/1546306589.html" rel="noopener noreferrer" target="_blank" style="color: inherit;">https://www.itread01.com/content/1546306589.html</a></p><p><a href="https://ithelp.ithome.com.tw/articles/10187739" rel="noopener noreferrer" target="_blank" style="color: inherit;">https://ithelp.ithome.com.tw/articles/10187739</a></p>`,
      },
      {
        id: "3",
        time: "2",
        name: "Tree",
        value: `<iframe class="ql-video" frameborder="0" allowfullscreen="true" src="https://www.youtube.com/embed/vRwi_UcZGjU?showinfo=0"></iframe><p><br></p><h1>Splay tree</h1><p><br></p><p>每次運算完要將node旋轉至root.</p><ul><li>若為 delete 則將被delete的node的parent 旋轉至root</li><li>insert, delete, search 的 amortized cost 皆為 O(logn)</li></ul><p><br></p><h1>AVL tree</h1><p>左右子樹高度不超過 1 → balance factor = 0 , 1, -1</p><p>balance factor: h_L - h_R</p><ul><li>若發生 |balance factor| &gt; 1 時 需做 rotation 維持AVL tree structure.</li><li>因維持樹高，可以使 insert, delete 的worst case 皆為 O(log n)</li><li>樹高為 h 的 AVL 樹最少的節點個數:</li></ul><p><br></p><h1>B-tree (m-way search tree)</h1><p>定義:</p><ol><li>root 至少有 2個子樹</li><li>每個子樹要有ceil(m/2)個子樹</li><li>每個 leaf node 樹高相同</li></ol><p><br></p><h3><strong>insert</strong></h3><pre class="ql-syntax" spellcheck="false">// insert into node p
        // m-way search tree&nbsp;
        
        while p's key &gt; m-1:
        &nbsp;&nbsp;split p into two node
            move p[m/2] to p's parent
            p's parent = p
        </pre><p><strong>delete</strong></p><pre class="ql-syntax" spellcheck="false">// delete from leaf node q
        //q's parent is p
        //q's sibling is r
        
        while degree(q) &lt; ceil(m/2): // 2-3 tree, 2-3-4 tree 皆須包含至少 1 個 node
        &nbsp;&nbsp;r = q's sibling
            if degree(r) &gt; ceil(m/2):
        &nbsp;&nbsp;&nbsp;&nbsp;rotate a key from r to q
        &nbsp;&nbsp;else:
                move a key from p to r and merge r, q
        &nbsp;&nbsp;&nbsp;&nbsp;q = p
        
        // delete k from inner node q
        
        delete k and move k's inorder successor to q.
        and perform delete.&nbsp;
        </pre><p><br></p>`,
      },
      {
        id: "4",
        time: "3",
        name: "CNN",
        value: `<h1><strong>Convolutional Neural Networks, Explained</strong></h1><p><br></p><p><img src="https://miro.medium.com/v2/resize:fit:1400/0*KJo04RdQY795dVnO"></p><p>Photo by&nbsp;<a href="https://unsplash.com/@cgower?utm_source=medium&amp;utm_medium=referral" rel="noopener noreferrer" target="_blank" style="color: inherit;">Christopher Gower</a>&nbsp;on&nbsp;<a href="https://unsplash.com/?utm_source=medium&amp;utm_medium=referral" rel="noopener noreferrer" target="_blank" style="color: inherit;">Unsplash</a></p><p>A Convolutional Neural Network, also known as CNN or ConvNet, is a class of&nbsp;<a href="https://datascience.hubs.vidyard.com/watch/CYfbzzj57RPfCwoMnEHD4M" rel="noopener noreferrer" target="_blank" style="color: inherit;">neural networks</a>&nbsp;that specializes in processing data that has a grid-like topology, such as an image. A digital image is a binary representation of visual data. It contains a series of pixels arranged in a grid-like fashion that contains pixel values to denote how bright and what color each pixel should be.</p><p><img src="https://miro.medium.com/v2/resize:fit:874/1*QJtTdtPhikY3KywV44L0Pw.png"></p><p>Figure 1: Representation of image as a grid of pixels (<a href="http://pippin.gimp.org/image_processing/images/sample_grid_a_square.png" rel="noopener noreferrer" target="_blank" style="color: inherit;">Source</a>)</p><p>The human brain processes a huge amount of information the second we see an image. Each neuron works in its own receptive field and is connected to other neurons in a way that they cover the entire visual field. Just as each neuron responds to stimuli only in the restricted region of the visual field called the receptive field in the biological vision system, each neuron in a CNN processes data only in its receptive field as well. The layers are arranged in such a way so that they detect simpler patterns first (lines, curves, etc.) and more complex patterns (faces, objects, etc.) further along. By using a CNN, one can&nbsp;<a href="https://www.datascience.com/blog/computer-vision-in-artificial-intelligence" rel="noopener noreferrer" target="_blank" style="color: inherit;">enable sight to computers</a>.</p><h1>Convolutional Neural Network Architecture</h1><p>A CNN typically has three layers: a convolutional layer, a pooling layer, and a fully connected layer.</p><p><br></p><p><img src="https://miro.medium.com/v2/resize:fit:1400/1*kkyW7BR5FZJq4_oBTx3OPQ.png"></p><p>Figure 2: Architecture of a CNN (<a href="https://www.mathworks.com/videos/introduction-to-deep-learning-what-are-convolutional-neural-networks--1489512765771.html" rel="noopener noreferrer" target="_blank" style="color: inherit;">Source</a>)</p><h1>Convolution Layer</h1><p>The convolution layer is the core building block of the CNN. It carries the main portion of the network’s computational load.</p><p>This layer performs a dot product between two matrices, where one matrix is the set of learnable parameters otherwise known as a kernel, and the other matrix is the restricted portion of the receptive field. The kernel is spatially smaller than an image but is more in-depth. This means that, if the image is composed of three (RGB) channels, the kernel height and width will be spatially small, but the depth extends up to all three channels.</p><p><img src="https://miro.medium.com/v2/resize:fit:1400/1*ulfFYH5HbWpLTIfuebj5mQ.gif"></p><p>Illustration of Convolution Operation (<a href="https://miro.medium.com/max/2340/1*Fw-ehcNBR9byHtho-Rxbtw.gif" rel="noopener noreferrer" target="_blank" style="color: inherit;">source</a>)</p><p>During the forward pass, the kernel slides across the height and width of the image-producing the image representation of that receptive region. This produces a two-dimensional representation of the image known as an activation map that gives the response of the kernel at each spatial position of the image. The sliding size of the kernel is called a stride.</p><p>If we have an input of size W x W x D and Dout number of kernels with a spatial size of F with stride S and amount of padding P, then the size of output volume can be determined by the following formula:</p><p><img src="https://miro.medium.com/v2/resize:fit:1186/1*gRWLLPaarbD3sR-OFeh4mg.png"></p><p>Formula for Convolution Layer</p><p>This will yield an output volume of size&nbsp;<em>Wout&nbsp;</em>x&nbsp;<em>Wou</em>t x&nbsp;<em>Dout</em>.</p><p><img src="https://miro.medium.com/v2/resize:fit:1400/1*r13ZUdVTQwVuhDPmo3JKag.png"></p><p>Figure 3: Convolution Operation (Source: Deep Learning by Ian Goodfellow, Yoshua Bengio, and Aaron Courville)</p><p><strong>Motivation behind Convolution</strong></p><p>Convolution leverages three important ideas that motivated computer vision researchers: sparse interaction, parameter sharing, and equivariant representation. Let’s describe each one of them in detail.</p><p>Trivial neural network layers use matrix multiplication by a matrix of parameters describing the interaction between the input and output unit. This means that every output unit interacts with every input unit. However, convolution neural networks have&nbsp;<em>sparse interaction.&nbsp;</em>This is achieved by making kernel smaller than the input e.g., an image can have millions or thousands of pixels, but while processing it using kernel we can detect meaningful information that is of tens or hundreds of pixels. This means that we need to store fewer parameters that not only reduces the memory requirement of the model but also improves the statistical efficiency of the model.</p><p>If computing one feature at a spatial point (x1, y1) is useful then it should also be useful at some other spatial point say (x2, y2). It means that for a single two-dimensional slice i.e., for creating one activation map, neurons are constrained to use the same set of weights. In a traditional neural network, each element of the weight matrix is used once and then never revisited, while convolution network has&nbsp;<em>shared parameters</em>&nbsp;i.e., for getting output, weights applied to one input are the same as the weight applied elsewhere.</p><p>Due to parameter sharing, the layers of convolution neural network will have a property of&nbsp;<em>equivariance to translation</em>. It says that if we changed the input in a way, the output will also get changed in the same way.</p><h1>Pooling Layer</h1><p>The pooling layer replaces the output of the network at certain locations by deriving a summary statistic of the nearby outputs. This helps in reducing the spatial size of the representation, which decreases the required amount of computation and weights. The pooling operation is processed on every slice of the representation individually.</p><p>There are several pooling functions such as the average of the rectangular neighborhood, L2 norm of the rectangular neighborhood, and a weighted average based on the distance from the central pixel. However, the most popular process is max pooling, which reports the maximum output from the neighborhood.</p><p><img src="https://miro.medium.com/v2/resize:fit:1400/1*sK7oP1m129V_oNGSsHIm_w.png"></p><p>Figure 4: Pooling Operation (Source: O’Reilly Media)</p><p>If we have an activation map of size&nbsp;<em>W</em>&nbsp;x&nbsp;<em>W</em>&nbsp;x&nbsp;<em>D</em>, a pooling kernel of spatial size&nbsp;<em>F</em>, and stride&nbsp;<em>S</em>, then the size of output volume can be determined by the following formula:</p><p><img src="https://miro.medium.com/v2/resize:fit:906/1*344e5tcOV5r6emjE6Detug.png"></p><p>Formula for Padding Layer</p><p>This will yield an output volume of size&nbsp;<em>Wout&nbsp;</em>x&nbsp;<em>Wout</em>&nbsp;x&nbsp;<em>D</em>.</p><p>In all cases, pooling provides some translation invariance which means that an object would be recognizable regardless of where it appears on the frame.</p><h1>Fully Connected Layer</h1><p>Neurons in this layer have full connectivity with all neurons in the preceding and succeeding layer as seen in regular FCNN. This is why it can be computed as usual by a matrix multiplication followed by a bias effect.</p><p>The FC layer helps to map the representation between the input and the output.</p><h1>Non-Linearity Layers</h1><p>Since convolution is a linear operation and images are far from linear, non-linearity layers are often placed directly after the convolutional layer to introduce non-linearity to the activation map.</p><p>There are several types of non-linear operations, the popular ones being:</p><p><strong>1. Sigmoid</strong></p><p>The sigmoid non-linearity has the mathematical form σ(κ) = 1/(1+e¯κ). It takes a real-valued number and “squashes” it into a range between 0 and 1.</p><p>However, a very undesirable property of sigmoid is that when the activation is at either tail, the gradient becomes almost zero. If the local gradient becomes very small, then in backpropagation it will effectively “kill” the gradient. Also, if the data coming into the neuron is always positive, then the output of sigmoid will be either all positives or all negatives, resulting in a zig-zag dynamic of gradient updates for weight.</p><p><strong>2. Tanh</strong></p><p>Tanh squashes a real-valued number to the range [-1, 1]. Like sigmoid, the activation saturates, but — unlike the sigmoid neurons — its output is zero centered.</p><p><strong>3. ReLU</strong></p><p>The Rectified Linear Unit (ReLU) has become very popular in the last few years. It computes the function ƒ(κ)=max (0,κ). In other words, the activation is simply threshold at zero.</p><p>In comparison to sigmoid and tanh, ReLU is more reliable and accelerates the convergence by six times.</p><p>Unfortunately, a con is that ReLU can be fragile during training. A large gradient flowing through it can update it in such a way that the neuron will never get further updated. However, we can work with this by setting a proper learning rate.</p><h1>Designing a Convolutional Neural Network</h1><p>Now that we understand the various components, we can build a convolutional neural network. We will be using Fashion-MNIST, which is a dataset of Zalando’s article images consisting of a training set of 60,000 examples and a test set of 10,000 examples. Each example is a 28x28 grayscale image, associated with a label from 10 classes. The dataset can be downloaded&nbsp;<a href="https://www.researchgate.net/publication/319312259_Fashion-MNIST_a_Novel_Image_Dataset_for_Benchmarking_Machine_Learning_Algorithms" rel="noopener noreferrer" target="_blank" style="color: inherit;">here</a>.</p><p>Our convolutional neural network has architecture as follows:</p><p>[INPUT]</p><p>→[CONV 1] → [BATCH NORM] → [ReLU] → [POOL 1]</p><p>→ [CONV 2] → [BATCH NORM] → [ReLU] → [POOL 2]</p><p>→ [FC LAYER] → [RESULT]</p><p>For both conv layers, we will use kernel of spatial size 5 x 5 with stride size 1 and padding of 2. For both pooling layers, we will use max pool operation with kernel size 2, stride 2, and zero padding.</p><p><img src="https://miro.medium.com/v2/resize:fit:1396/1*rBRpn5N-rqyqhiq8oHqazg.png"></p><p>Calculations for Conv 1 Layer (Image by Author)</p><p><img src="https://miro.medium.com/v2/resize:fit:1400/1*uw6gkcjrGYrYQVVzX8vq0A.png"></p><p>Calculations for Pool1 Layer (Image by Author)</p><p><img src="https://miro.medium.com/v2/resize:fit:1400/1*6CAo95ZZDix3T5-XBNn0OQ.png"></p><p>Calculations for Conv 2 Layer (Image by Author)</p><p><img src="https://miro.medium.com/v2/resize:fit:1400/1*9Pg-HKIUnidI1giI_APiHw.png"></p><p>Calculations for Pool2 Layer (Image by Author)</p><p><img src="https://miro.medium.com/v2/resize:fit:1392/1*19thiROjVTaPym_I0yZEjA.png"></p><p>Size of Fully Connected Layer (Image by Author)</p><p>Code snipped for defining the convnet</p><pre class="ql-syntax" spellcheck="false">class convnet1(nn.Module):
    def __init__(self):
        super(convnet1, self).__init__()
        
        # Constraints for layer 1
        self.conv1 = nn.Conv2d(in_channels=1, out_channels=16, kernel_size=5, stride = 1, padding=2)
        self.batch1 = nn.BatchNorm2d(16)
        self.relu1 = nn.ReLU()
        self.pool1 = nn.MaxPool2d(kernel_size=2) #default stride is equivalent to the kernel_size
        
        # Constraints for layer 2
        self.conv2 = nn.Conv2d(in_channels=16, out_channels=32, kernel_size=5, stride = 1, padding=2)
        self.batch2 = nn.BatchNorm2d(32)
        self.relu2 = nn.ReLU()
        self.pool2 = nn.MaxPool2d(kernel_size=2)
        
        # Defining the Linear layer
        self.fc = nn.Linear(32*7*7, 10)
    
    # defining the network flow
    def forward(self, x):
        # Conv 1
        out = self.conv1(x)
        out = self.batch1(out)
        out = self.relu1(out)
        
        # Max Pool 1
        out = self.pool1(out)
        
        # Conv 2
        out = self.conv2(out)
        out = self.batch2(out)
        out = self.relu2(out)
        
        # Max Pool 2
        out = self.pool2(out)
        
        out = out.view(out.size(0), -1)
        # Linear Layer
        out = self.fc(out)
        
        return out
</pre><p>We have also used batch normalization in our network, which saves us from improper initialization of weight matrices by explicitly forcing the network to take on unit Gaussian distribution. The code for the above-defined network is available&nbsp;<a href="https://github.com/mayankskb/DL-Times/blob/master/DL-Models/FashionMNIST-classification/Fashion-MNIST%20Classification.ipynb" rel="noopener noreferrer" target="_blank" style="color: inherit;">here</a>. We have trained using cross-entropy as our loss function and the Adam Optimizer with a learning rate of 0.001. After training the model, we achieved 90% accuracy on the test dataset.</p><h1>Applications</h1><p>Below are some applications of Convolutional Neural Networks used today:</p><p><br></p><p>1. Object detection: With CNN, we now have sophisticated models like&nbsp;<a href="https://www.cv-foundation.org/openaccess/content_cvpr_2014/papers/Girshick_Rich_Feature_Hierarchies_2014_CVPR_paper.pdf" rel="noopener noreferrer" target="_blank" style="color: inherit;">R-CNN</a>,&nbsp;<a href="https://arxiv.org/pdf/1504.08083.pdf" rel="noopener noreferrer" target="_blank" style="color: inherit;">Fast R-CNN</a>, and&nbsp;<a href="https://arxiv.org/pdf/1506.01497.pdf" rel="noopener noreferrer" target="_blank" style="color: inherit;">Faster R-CNN</a>&nbsp;that are the predominant pipeline for many object detection models deployed in autonomous vehicles, facial detection, and more.</p><p>2. Semantic segmentation: In 2015, a group of researchers from Hong Kong developed a CNN-based&nbsp;<a href="https://arxiv.org/pdf/1509.02634.pdf" rel="noopener noreferrer" target="_blank" style="color: inherit;">Deep Parsing Network</a>&nbsp;to incorporate rich information into an image segmentation model. Researchers from UC Berkeley also built&nbsp;<a href="https://www.cv-foundation.org/openaccess/content_cvpr_2015/papers/Long_Fully_Convolutional_Networks_2015_CVPR_paper.pdf" rel="noopener noreferrer" target="_blank" style="color: inherit;">fully convolutional networks</a>&nbsp;that improved upon state-of-the-art semantic segmentation.</p><p>3. Image captioning: CNNs are used with recurrent neural networks to write captions for images and videos. This can be used for many applications such as activity recognition or describing videos and images for the visually impaired. It has been heavily deployed by YouTube to make sense to the huge number of videos uploaded to the platform on a regular basis.</p><h1>References</h1><p>1. Deep Learning by Ian Goodfellow, Yoshua Bengio and Aaron Courville published by MIT Press, 2016</p><p>2. Stanford University’s Course — CS231n: Convolutional Neural Network for Visual Recognition by Prof. Fei-Fei Li, Justin Johnson, Serena Yeung</p><p>3.&nbsp;<a href="https://datascience.stackexchange.com/questions/14349/difference-of-activation-functions-in-neural-networks-in-general" rel="noopener noreferrer" target="_blank" style="color: inherit;">https://datascience.stackexchange.com/questions/14349/difference-of-activation-functions-in-neural-networks-in-general</a></p><p>4.&nbsp;<a href="https://www.codementor.io/james_aka_yale/convolutional-neural-networks-the-biologically-inspired-model-iq6s48zms" rel="noopener noreferrer" target="_blank" style="color: inherit;">https://www.codementor.io/james_aka_yale/convolutional-neural-networks-the-biologically-inspired-model-iq6s48zms</a></p><p>5.&nbsp;<a href="https://searchenterpriseai.techtarget.com/definition/convolutional-neural-network" rel="noopener noreferrer" target="_blank" style="color: inherit;">https://searchenterpriseai.techtarget.com/definition/convolutional-neural-network</a></p><p><a href="https://medium.com/tag/computer-vision?source=post_page-----9cc5188c4939---------------computer_vision-----------------" rel="noopener noreferrer" target="_blank" style="color: inherit;">Computer Vision</a></p><p><a href="https://medium.com/tag/cnn?source=post_page-----9cc5188c4939---------------cnn-----------------" rel="noopener noreferrer" target="_blank" style="color: inherit;">Cnn</a></p><p><a href="https://medium.com/tag/convolution-network?source=post_page-----9cc5188c4939---------------convolution_network-----------------" rel="noopener noreferrer" target="_blank" style="color: inherit;">Convolution Network</a></p><p><a href="https://medium.com/tag/fashionmnist?source=post_page-----9cc5188c4939---------------fashionmnist-----------------" rel="noopener noreferrer" target="_blank" style="color: inherit;">Fashionmnist</a></p><p><a href="https://medium.com/tag/writing-nn?source=post_page-----9cc5188c4939---------------writing_nn-----------------" rel="noopener noreferrer" target="_blank" style="color: inherit;">Writing Nn</a></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p>`,
      },
      {
        id: "5",
        time: "4",
        name: "RNN",
        value: `<p>原文：<a href="https://brohrer.github.io/how_rnns_lstm_work.html" rel="noopener noreferrer" target="_blank" style="background-color: initial; color: rgb(65, 131, 196);"><strong>How Recurrent Neural Networks and Long Short-Term Memory Work</strong></a></p><p>Translated from Brandon Rohrer's Blog by Jimmy Lin</p><iframe class="ql-video" frameborder="0" allowfullscreen="true" src="https://www.youtube.com/embed/WCUNPb-5EYI?controls=1&amp;autoplay=0&amp;modestbranding=1&amp;rel=0&amp;enablejsapi=1&amp;origin=https%3A%2F%2Fbrohrer.mcknote.com&amp;widgetid=1"></iframe><p><br></p><p>相關連結：</p><ul><li><a href="https://docs.google.com/presentation/d/1hqYB3LRwg_-ntptHxH18W1ax9kBwkaZ1Pa_s3L7R-2Y/edit?usp=sharing" rel="noopener noreferrer" target="_blank" style="background-color: initial; color: rgb(65, 131, 196);">Google 投影片</a></li><li>本文翻譯自&nbsp;<a href="https://www.linkedin.com/in/elham-khanchebemehr-b679547b/" rel="noopener noreferrer" target="_blank" style="background-color: initial; color: rgb(65, 131, 196);">Elham Khanchebemehr</a>&nbsp;的<a href="https://elham-khanche.github.io/blog/RNNs_and_LSTM/" rel="noopener noreferrer" target="_blank" style="background-color: initial; color: rgb(65, 131, 196);">英文逐字稿</a>，非常感謝</li></ul><p><a href="https://youtu.be/WCUNPb-5EYI?t=2" rel="noopener noreferrer" target="_blank" style="color: rgb(65, 131, 196);"><img src="https://elham-khanche.github.io/blog/assets/img/RNN/Slide1.png"><em>圖說：遞歸神經網路和長短期記憶模型的運作原理</em></a></p><p>這幾年，機器學習（machine learning）相關的應用獲得了許多關注，其中有幾大領域特別熱門：其中一個是圖片辨識，像是在網路上搜尋貓咪的圖片，或是將任何問題轉為類似形式；另一個則是序列到序列翻譯（sequence to sequence translation），包括將語音轉為文字或翻譯不同語言。前者大多是利用<a href="https://brohrer.mcknote.com/zh-Hant/how_machine_learning_works/how_convolutional_neural_networks_work.html" rel="noopener noreferrer" target="_blank" style="background-color: initial; color: rgb(65, 131, 196);"><strong>卷積神經網路</strong></a>（convolutional neural networks，CNN）所完成，後者則多利用<strong>遞歸神經網路</strong>（recurrent neural networks，RNN），尤其是<strong>長短期記憶模型</strong>（long short-term memory，LSTM）。</p><h2><strong>晚餐要吃什麼</strong></h2><p>為了理解 LSTM 的運作原理，我們可以考慮一下「晚餐要吃什麼」這個問題：假設讀者住在公寓，很幸運地有個愛煮晚餐的室友。每天晚上室友都會準備壽司、鬆餅或披薩，而你希望能預測某個晚上你會吃什麼，並藉此規劃其他晚餐。為了預測晚餐，讀者建了一個神經網路模型。這個模型的輸入資料包括星期幾、第幾個月、以及室友是否開會開到很晚等會影響晚餐的因素。</p><p><a href="https://youtu.be/WCUNPb-5EYI?t=76" rel="noopener noreferrer" target="_blank" style="color: rgb(65, 131, 196);"><img src="https://elham-khanche.github.io/blog/assets/img/RNN/Slide2.png"><em>圖說：晚餐要吃什麼？</em></a></p><p>講到這裡，如果讀者對神經網路還不熟悉，可以花一點時閱讀〈<a href="https://brohrer.mcknote.com/zh-Hant/how_machine_learning_works/how_neural_networks_work.html" rel="noopener noreferrer" target="_blank" style="background-color: initial; color: rgb(65, 131, 196);">神經網路的運作原理</a>〉。</p><p><a href="https://youtu.be/WCUNPb-5EYI?t=91" rel="noopener noreferrer" target="_blank" style="color: rgb(65, 131, 196);"><img src="https://elham-khanche.github.io/blog/assets/img/RNN/CNNs.png"><em>圖說：神經網路的運作原理</em></a></p><p>如果讀者想先跳過其他文章，又還不清楚神經網路是什麼，可以先把神經網路想成一個投票過程。神經網路裡包含了一個複雜的投票過程，而我們所輸入的資料，如星期幾、第幾個月等等，都會進入這個過程。接著我們可以根據過去的晚餐訓練這個模型，並預測今天的晚餐。</p><p>不過，用這種方法訓練的模型，表現並不是很好。就算我們謹慎挑選輸入資料並訓練模型，它的表現還是沒有比隨機猜測好上多少。</p><p>和其他複雜的機器學習問題一樣，先退一步回顧資料，可以幫助我們找出其中的規律。於是我們發現，原來室友在做完披薩後的隔天會準備壽司，再隔一天會準備鬆餅，然後又回去做披薩，就這樣持續下去。由於這個循環很普通，跟星期幾沒什麼關係，我們可以根據這項特徵訓練一個新的神經網路模型。</p><p>在這個新的模型裡，唯一重要的因素只有昨天吃過的晚餐，所以如果昨天吃披薩，今天就會吃壽司；昨天吃壽司，今天吃鬆餅；昨天吃鬆餅，今天吃披薩。整個投票過程變得非常簡單，預測也很準確，因為你的室友做事非常連貫。</p><p><a href="https://youtu.be/WCUNPb-5EYI?t=170" rel="noopener noreferrer" target="_blank" style="color: rgb(65, 131, 196);"><img src="https://elham-khanche.github.io/blog/assets/img/RNN/Slide3.png"><em>圖說：晚餐出現的循環</em></a></p><p>現在考慮另一個情況：如果讀者有某一晚不在家，像是昨天晚上出門了，那就無從得知昨天晚餐吃什麼。不過，我們還是能從幾天前的晚餐推測今天會吃什麼——只要先從更早之前推回昨天的晚餐，就能接著預測今天的晚餐。</p><p><a href="https://youtu.be/WCUNPb-5EYI?t=218" rel="noopener noreferrer" target="_blank" style="color: rgb(65, 131, 196);"><img src="https://elham-khanche.github.io/blog/assets/img/RNN/Slide4.png"><em>圖說：根據昨天的歷史或預測結果預測</em></a></p><p>總之，我們不只能利用昨晚實際吃什麼，也能利用昨晚的預測結果。</p><h2><strong>向量和 one-hot 編碼</strong></h2><p>講到這裡，我們可以先岔開談一談什麼是<strong>向量</strong>（vector）。向量只是用來表示一組數字的數學名詞。如果我想描述某一天的天氣，我可以說當天的最高溫是華氏 76 度（約攝氏 24.5 度），最低溫是 43 度（約攝氏 6 度），風速是每小時 13 英里（約 21 公里），而且降下 0.25 吋（約 6.4 公釐）雨量的機率是 83%。</p><p><a href="https://youtu.be/WCUNPb-5EYI?t=235" rel="noopener noreferrer" target="_blank" style="color: rgb(65, 131, 196);"><img src="https://elham-khanche.github.io/blog/assets/img/RNN/Slide5.png"><em>圖說：包含天氣資訊的向量</em></a></p><p>這就是所謂的向量。向量，也就是一組數字，之所以方便，在於它是電腦原生的語言。如果讀者想將資料轉成電腦能夠運算、處理、並能應用機器學習的形式，一組數字即為正確選擇。所以任何資訊在經過演算法處理前，都會先被轉換成一組數字。就連 「今天是週二」這個概念，我們也可以利用向量表示。</p><p>要表達這類的資訊，我們只要先在向量中包含所有可能的值，也就是週一到週日，再為每個值賦予特定的數字，將週二設為 1（Boolean True），其他日子設為 0（Boolean False）。這種格式被稱作&nbsp;<strong>one-hot 編碼</strong>（或譯作「獨熱編碼」），而這種包含一連串 0、只有一個 1 的向量在資料分析中也很常見。</p><p><a href="https://youtu.be/WCUNPb-5EYI?t=282" rel="noopener noreferrer" target="_blank" style="color: rgb(65, 131, 196);"><img src="https://elham-khanche.github.io/blog/assets/img/RNN/Slide6.png"><em>圖說：使用 one-hot 編碼的向量</em></a></p><p>雖然 one-hot 編碼看起來很沒效率，實際上這能幫助電腦更簡單地處理資訊，所以我們可以將「今天晚餐吃甚麼」的預測轉換成一個 one-hot 向量，將預測結果之外的數值都設為 0。在下圖的例子裡，我們預測的晚餐是壽司。</p><p><a href="https://youtu.be/WCUNPb-5EYI?t=309" rel="noopener noreferrer" target="_blank" style="color: rgb(65, 131, 196);"><img src="https://elham-khanche.github.io/blog/assets/img/RNN/Slide7.png"><em>圖說：將晚餐選擇轉為 one-hot 向量</em></a></p><p>現在我們可以將所有的輸入和輸出組合成幾個向量，也就是幾組數字。這可以幫助我們解釋整個神經網路的架構。利用我們歸納出的三個向量：昨天的預測、昨天的結果、以及今天的預測，這裡的神經網路架構即為每個輸入因素和輸出因素間的<strong>關聯</strong>（connection）。</p><p><a href="https://youtu.be/WCUNPb-5EYI?t=320" rel="noopener noreferrer" target="_blank" style="color: rgb(65, 131, 196);"><img src="https://elham-khanche.github.io/blog/assets/img/RNN/Slide9.png"><em>圖說：輸入因素和輸出因素間的關聯</em></a></p><p>為了完成上面的示意圖，我們可以加上今日預測結果的回收循環。下圖中的虛線，表示了今天的預測結果如何在明天被重新利用，成為明天的「昨日預測」。</p><p><a href="https://youtu.be/WCUNPb-5EYI?t=360" rel="noopener noreferrer" target="_blank" style="color: rgb(65, 131, 196);"><img src="https://elham-khanche.github.io/blog/assets/img/RNN/Slide10.png"><em>圖說：輸入因素和輸出因素間的關聯</em></a></p><p>這個模型也說明了為什麼我們在缺少某些資訊的情況下（例如不在家兩週），還是能準確預測今晚吃甚麼。只要忽略接收新資訊的部分，我們就能將紀錄時間和餐點的向量延伸到最近的資料點，並接著預測下去。</p><p>延伸過後的神經網路如下圖所示。我們可以從最前端一直往過去的資料延伸，看更早之前的晚餐是甚麼，再往兩週的空缺延伸，直到我們得到今晚的預測。</p><p><a href="https://youtu.be/WCUNPb-5EYI?t=388" rel="noopener noreferrer" target="_blank" style="color: rgb(65, 131, 196);"><img src="https://elham-khanche.github.io/blog/assets/img/RNN/Slide12.png"><em>圖說：延伸後的預測結果</em></a></p><h2><strong>寫一本童書</strong></h2><p>以上就是一個理解 RNN 運作原理的好例子。不過為了突顯這個模型的限制，我們可以換一個寫童書的例子。這本童書裡只有三種句子：「道格看見珍（句號）」、「珍看見小點（句號）」、以及「小點看見道格（句號）」。</p><p><a href="https://youtu.be/WCUNPb-5EYI?t=427" rel="noopener noreferrer" target="_blank" style="color: rgb(65, 131, 196);"><img src="https://elham-khanche.github.io/blog/assets/img/RNN/Slide13.png"><em>圖說：寫一本童書</em></a></p><p>這本童書的字彙量很小，只有「道格」、「珍」、「小點」、「看見」以及句號。在這個例子裡，神經網路的功用在於將這些單字按正確的順序排好，完成一本童書。我們先將前面的晚餐向量，換成這個例子裡的字典向量。</p><p><a href="https://youtu.be/WCUNPb-5EYI?t=445" rel="noopener noreferrer" target="_blank" style="color: rgb(65, 131, 196);"><img src="https://elham-khanche.github.io/blog/assets/img/RNN/Slide14.png"><em>圖說：前後關聯的單字預測</em></a></p><p>接著我們就能用前面的方法（即 one-hot）表達不同單字。如果道格是我最後讀到的單字，那我的資訊向量中，就只有道格的數值為 1，其他的數值都為 0。我們也可以按前面的方法，利用昨天（前一次）的預測結果，繼續預測明天（下一次）的結果。經過一定的訓練後，我們應該能從模型中看出一些特定的規律。像是在「珍、道格、小點」之後，模型預測「看見」和句點的機率應該會大幅提升，因為這兩個單字都會跟著特定名字出現。</p><p><a href="https://youtu.be/WCUNPb-5EYI?t=479" rel="noopener noreferrer" target="_blank" style="color: rgb(65, 131, 196);"><img src="https://elham-khanche.github.io/blog/assets/img/RNN/Slide15.png"><em>圖說：單字之間的關聯（一）</em></a></p><p>同樣地，如果我們前一次預測了名字，那這些預測也會加強接下來預測「看見」或句號的機率；如果我們看到「看見」或句號，也能想像模型接下來會傾向於預測「珍、道格、小點」等名字。</p><p><a href="https://youtu.be/WCUNPb-5EYI?t=501" rel="noopener noreferrer" target="_blank" style="color: rgb(65, 131, 196);"><img src="https://elham-khanche.github.io/blog/assets/img/RNN/Slide16.png"><em>圖說：單字之間的關聯（二）</em></a></p><p><a href="https://youtu.be/WCUNPb-5EYI?t=504" rel="noopener noreferrer" target="_blank" style="color: rgb(65, 131, 196);"><img src="https://elham-khanche.github.io/blog/assets/img/RNN/Slide17.png"><em>圖說：單字之間的關聯（三）</em></a></p><p>於是，我們可以將這個流程和架構視為一個 RNN 模型。為了簡單起見，這裡我將向量和投票權重用一個包含點和線（箭頭）的符號代替。</p><p><a href="https://youtu.be/WCUNPb-5EYI?t=527" rel="noopener noreferrer" target="_blank" style="color: rgb(65, 131, 196);"><img src="https://elham-khanche.github.io/blog/assets/img/RNN/Slide18.png"><em>圖說：簡化後的 RNN 模型</em></a></p><h2><strong>擠壓函數（雙曲正切函數）</strong></h2><p>除了模型本身，這張圖還包括了一個我們前面沒提到的符號。這個波浪符號代表<strong>擠壓函數</strong>（squashing function，又譯作 S 函數），它可以幫助整個神經網路更好運作。</p><p><a href="https://youtu.be/WCUNPb-5EYI?t=546" rel="noopener noreferrer" target="_blank" style="color: rgb(65, 131, 196);"><img src="https://elham-khanche.github.io/blog/assets/img/RNN/Slide19.png"><em>圖說：擠壓函數（雙曲正切函數）</em></a></p><p>擠壓函數的功用，是將模型的投票結果限制在特定範圍之間。比方說，如果有個投票結果得到 0.5 的值，我們可以在擠壓函數上畫一條 x = 0.5 的垂直線，並得到水平對應的 y 值，也就是擠壓過後的數值。</p><p><a href="https://youtu.be/WCUNPb-5EYI?t=569" rel="noopener noreferrer" target="_blank" style="color: rgb(65, 131, 196);"><img src="https://elham-khanche.github.io/blog/assets/img/RNN/Slide22.png"><em>圖說：擠壓函數上的數值對應（一）</em></a></p><p>對於小的數值而言，原始數值和擠壓過構的數值通常很相近，但隨著數值增大，擠壓過後的數值會越來越接近 1。隨著數值愈趨負無窮大，擠壓過後的數值也會越來越接近 -1。不論如何，擠壓過後的數值都會介於 1 和 -1 之間。</p><p><a href="https://youtu.be/WCUNPb-5EYI?t=574" rel="noopener noreferrer" target="_blank" style="color: rgb(65, 131, 196);"><img src="https://elham-khanche.github.io/blog/assets/img/RNN/Slide25.png"><em>圖說：擠壓函數上的數值對應（二）</em></a></p><p>擠壓函數的處理，對於神經網路這種重複運算相同數值的流程非常有用。比方說，如果有個選項每次都得到兩次投票，它的數值也會被乘以二，隨著流程重複，這個數字很容易被放大成天文數字。藉由確保數值介於 1 和 -1 之間，即使我們將數值相乘無數次，也不用擔心它會在循環中無限增大。這是一種<strong>負回饋</strong>（negative feedback）或<strong>衰減回饋</strong>（attenuating feedback）的例子。</p><h1><br></h1>`,
      },
    ],
  },
  {
    id: "user1_2",
    nodes: [
      {
        id: "1",
        value: `<h1>Tutorial: Create a web API with ASP.NET Core</h1><ul><li>Article03/27/2023</li><li>64 minutes to read50 contributors</li></ul><p>Feedback</p><p>By&nbsp;<a href="https://twitter.com/RickAndMSFT" rel="noopener noreferrer" target="_blank" style="background-color: rgba(0, 0, 0, 0); color: var(--theme-hyperlink);">Rick Anderson</a>&nbsp;and&nbsp;<a href="https://twitter.com/serpent5" rel="noopener noreferrer" target="_blank" style="background-color: rgba(0, 0, 0, 0); color: var(--theme-hyperlink);">Kirk Larkin</a></p><p>This tutorial teaches the basics of building a controller-based web API that uses a database. Another approach to creating APIs in ASP.NET Core is to create&nbsp;<em>minimal APIs</em>. For help in choosing between minimal APIs and controller-based APIs, see&nbsp;<a href="https://learn.microsoft.com/en-us/aspnet/core/fundamentals/apis?view=aspnetcore-7.0" rel="noopener noreferrer" target="_blank" style="background-color: rgba(0, 0, 0, 0); color: var(--theme-hyperlink);">APIs overview</a>. For a tutorial on creating a minimal API, see&nbsp;<a href="https://learn.microsoft.com/en-us/aspnet/core/tutorials/min-web-api?view=aspnetcore-7.0" rel="noopener noreferrer" target="_blank" style="background-color: rgba(0, 0, 0, 0); color: var(--theme-hyperlink);">Tutorial: Create a minimal API with ASP.NET Core</a>.</p><h2>Overview</h2><p>This tutorial creates the following API:</p><p>APIDescriptionRequest bodyResponse body<span style="background-color: var(--theme-inline-code);">GET /api/todoitems</span>Get all to-do itemsNoneArray of to-do items<span style="background-color: var(--theme-inline-code);">GET /api/todoitems/{id}</span>Get an item by IDNoneTo-do item<span style="background-color: var(--theme-inline-code);">POST /api/todoitems</span>Add a new itemTo-do itemTo-do item<span style="background-color: var(--theme-inline-code);">PUT /api/todoitems/{id}</span>Update an existing item&nbsp;To-do itemNone<span style="background-color: var(--theme-inline-code);">DELETE /api/todoitems/{id}</span>&nbsp;&nbsp;&nbsp;Delete an item&nbsp;&nbsp;NoneNone</p><p>The following diagram shows the design of the app.</p><p><img src="https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api/_static/architecture.png?view=aspnetcore-7.0"></p><h2>Prerequisites</h2><ul><li><a href="https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-7.0&amp;tabs=visual-studio#tabpanel_1_visual-studio" rel="noopener noreferrer" target="_blank" style="background-color: rgba(0, 0, 0, 0); color: var(--theme-text);">Visual Studio</a></li><li><a href="https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-7.0&amp;tabs=visual-studio#tabpanel_1_visual-studio-code" rel="noopener noreferrer" target="_blank" style="background-color: rgba(0, 0, 0, 0); color: var(--theme-text-subtle);">Visual Studio Code</a></li><li><a href="https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-7.0&amp;tabs=visual-studio#tabpanel_1_visual-studio-mac" rel="noopener noreferrer" target="_blank" style="background-color: rgba(0, 0, 0, 0); color: var(--theme-text-subtle);">Visual Studio for Mac</a></li><li><a href="https://visualstudio.microsoft.com/vs/#download" rel="noopener noreferrer" target="_blank" style="background-color: rgba(0, 0, 0, 0); color: var(--theme-hyperlink);">Visual Studio 2022</a>&nbsp;with the&nbsp;ASP.NET and web development&nbsp;workload.</li><li><img src="https://learn.microsoft.com/en-us/aspnet/core/tutorials/min-web-api/_static/asp-net-web-dev.png?view=aspnetcore-7.0"></li></ul><h2>Create a web project</h2><ul><li><a href="https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-7.0&amp;tabs=visual-studio#tabpanel_2_visual-studio" rel="noopener noreferrer" target="_blank" style="background-color: rgba(0, 0, 0, 0); color: var(--theme-text);">Visual Studio</a></li><li><a href="https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-7.0&amp;tabs=visual-studio#tabpanel_2_visual-studio-code" rel="noopener noreferrer" target="_blank" style="background-color: rgba(0, 0, 0, 0); color: var(--theme-text-subtle);">Visual Studio Code</a></li><li><a href="https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-7.0&amp;tabs=visual-studio#tabpanel_2_visual-studio-mac" rel="noopener noreferrer" target="_blank" style="background-color: rgba(0, 0, 0, 0); color: var(--theme-text-subtle);">Visual Studio for Mac</a></li><li>From the&nbsp;File&nbsp;menu, select&nbsp;New&nbsp;&gt;&nbsp;Project.</li><li>Enter&nbsp;<em>Web API</em>&nbsp;in the search box.</li><li>Select the&nbsp;ASP.NET Core Web API&nbsp;template and select&nbsp;Next.</li><li>In the&nbsp;Configure your new project dialog, name the project&nbsp;<em>TodoApi</em>&nbsp;and select&nbsp;Next.</li><li>In the&nbsp;Additional information&nbsp;dialog:</li><li class="ql-indent-1">Confirm the&nbsp;Framework&nbsp;is&nbsp;.NET 7.0&nbsp;(or later).</li><li class="ql-indent-1">Confirm the checkbox for&nbsp;Use controllers(uncheck to use minimal APIs)&nbsp;is checked.</li><li class="ql-indent-1">Select&nbsp;Create.</li></ul><p>&nbsp;Note</p><p><br></p><p>For guidance on adding packages to .NET apps, see the articles under&nbsp;<em>Install and manage packages</em>&nbsp;at&nbsp;<a href="https://learn.microsoft.com/en-us/nuget/consume-packages/overview-and-workflow" rel="noopener noreferrer" target="_blank" style="background-color: rgba(0, 0, 0, 0); color: var(--theme-info-dark);">Package consumption workflow (NuGet documentation)</a>. Confirm correct package versions at&nbsp;<a href="https://www.nuget.org/" rel="noopener noreferrer" target="_blank" style="background-color: rgba(0, 0, 0, 0); color: var(--theme-info-dark);">NuGet.org</a>.</p>`,
      },
      {
        id: "2",
        value: `<h2>What is scrum?</h2><p>Scrum is an agile project management framework that helps teams structure and manage their work through a set of values, principles, and practices. Much like a rugby team (where it gets its name) training for the big game, scrum encourages teams to learn through experiences, self-organize while working on a problem, and reflect on their wins and losses to continuously improve.</p><p>While the scrum I’m talking about is most frequently used by software development teams, its principles and lessons can be applied to all kinds of teamwork. This is one of the reasons scrum is so popular. Often thought of as an agile project management framework, scrum describes a set of meetings, tools, and roles that work in concert to help teams structure and manage their work.</p><p>In this article, we’ll discuss how a traditional scrum framework is comprised with the help of the&nbsp;<a href="https://www.scrumguides.org/" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 82, 204);">Scrum Guide</a>&nbsp;and David West, CEO of&nbsp;Scrum.org. We’ll also include examples of how we see our customers stray from these fundamentals to fit their specific needs. For that, our own Megan Cook, Group Product Manager for Jira Software and former agile coach, will give tips and tricks in our Agile Coach video series:</p><p><a href="https://www.youtube.com/watch?v=b02ZkndLk1Y" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 101, 255);"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAJCAYAAAA7KqwyAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAABFJREFUKBVjYBgFoyFAhRAAAAJJAAFEkgypAAAAAElFTkSuQmCC"></a></p><p><br></p>`,
      },
    ],
  },
  {
    id: "user1_3",
    nodes: [
      {
        id: "1",
        value: `<h2><a href="https://eatlovephoto.com/blog/post/219399299" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 0, 0);"><strong>台北不限時 AGCT apartment-走上樓的秘密空間，玻璃窗與咖啡香｜台北大安區溫州街、台電大樓站</strong></a></h2><ul><li>2016 / Jul / 21&nbsp;個人分類：<a href="https://eatlovephoto.com/blog/category/2649921" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 0, 0);">台北</a></li></ul><p><a href="http://www.flickr.com/photos/108107144@N05/28308127802" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 0, 0);"><img src="https://farm9.staticflickr.com/8063/28308127802_68a76701d4_c.jpg"></a></p><p>總是雷雨的午後，特別想找間清亮的咖啡館歇著，所以與朋友相約來到放在口袋名單裡許久的AGCT apartment。</p><p>在隱密的巷內，還需搭乘電梯上到三樓，咖啡館四周被玻璃窗給包圍著，外頭的陽光穿過窗戶，夾雜著樹蔭，畫面很透淨。</p><p>在這個不同於一般高度的空間裡，寂靜的很，似乎每位來到AGCT的客人都靜靜、享受著一個人的時光，盡興的看著書、做自己的工作。</p><p>我很喜歡這裡，是一種發自內心的喜歡。</p><p><strong>全文看此：</strong><a href="http://demi0130.pixnet.net/blog/post/219399299" rel="noopener noreferrer" target="_blank" style="color: rgb(84, 155, 237);"><strong><u>http://demi0130.pixnet.net/blog/post/219399299</u></strong></a></p><p><a href="http://www.flickr.com/photos/108107144@N05/28129765630" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 0, 0);"><img src="https://farm9.staticflickr.com/8696/28129765630_92400d0132_c.jpg"></a></p><p><a href="http://www.flickr.com/photos/108107144@N05/28129772400" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 0, 0);"><img src="https://farm9.staticflickr.com/8817/28129772400_4437c86749_c.jpg"></a></p><p><strong>AGCT apartment</strong>，是個結合工作室的設計咖啡館，走進店內除了能聽見杯盤的鏗鏘聲、嗅見咖啡氣息，還有隨處能見的設計商品。</p><p>有時候，在AGCT還會舉辦活動講座，<a href="https://www.facebook.com/AGCT.GROUP/" rel="noopener noreferrer" target="_blank" style="color: rgb(84, 155, 237);"><strong><u>詳情可以看他們的粉絲專頁了解。</u></strong></a></p><p><a href="http://www.flickr.com/photos/108107144@N05/28129768660" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 0, 0);"><img src="https://farm9.staticflickr.com/8204/28129768660_d8c18a80c1_c.jpg"></a></p><p>走過「路上撿到一隻貓」，繞進左側的靜謐巷子裡，便可以看見AGCT的入口，裡頭有座橘紅色的電梯，散發著淡淡的舊味，頗迷人。</p><p><a href="http://www.flickr.com/photos/108107144@N05/28129774540" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 0, 0);"><img src="https://farm8.staticflickr.com/7779/28129774540_edf4b5a848_c.jpg"></a></p><p>搭乘電梯來到三樓，便進入了AGCT的空間。</p><p>可以看見一旁擺放的設計服飾，這裡是結合了設計工作室的咖啡館，在咖啡香的圍繞之下工作，想必也是件頗幸福的事情。</p><p>或許是種默契，來到AGCT的客人大多是獨自前來做事的，就算是結伴同行，大家也會自動放低音量，一同靜靜享受這美好的氣氛。</p><p><a href="http://www.flickr.com/photos/108107144@N05/28129777110" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 0, 0);"><img src="https://farm8.staticflickr.com/7794/28129777110_01884a7be7_c.jpg"></a></p><p><a href="http://www.flickr.com/photos/108107144@N05/28129780280" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 0, 0);"><img src="https://farm9.staticflickr.com/8631/28129780280_b08f7c8d4d_c.jpg"></a></p><p><a href="http://www.flickr.com/photos/108107144@N05/28129783240" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 0, 0);"><img src="https://farm8.staticflickr.com/7723/28129783240_b923eca541_c.jpg"></a></p><p><a href="http://www.flickr.com/photos/108107144@N05/28129788430" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 0, 0);"><img src="https://farm9.staticflickr.com/8882/28129788430_130d0f2090_c.jpg"></a></p><p><a href="http://www.flickr.com/photos/108107144@N05/28412816945" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 0, 0);"><img src="https://farm9.staticflickr.com/8085/28412816945_2551d38030_c.jpg"></a></p><p>在AGCT，你可以領著一本雜誌、或是一本自己的書，找個自在的位子入座，並享受這份輕鬆愜意的舒適。</p><p><a href="http://www.flickr.com/photos/108107144@N05/27795689504" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 0, 0);"><img src="https://farm9.staticflickr.com/8708/27795689504_8280a839b3_c.jpg"></a></p><p><a href="http://www.flickr.com/photos/108107144@N05/28379505716" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 0, 0);"><img src="https://farm9.staticflickr.com/8799/28379505716_7fa1bd30f4_c.jpg"></a></p><p><a href="http://www.flickr.com/photos/108107144@N05/27796902893" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 0, 0);"><img src="https://farm9.staticflickr.com/8714/27796902893_abe741c906_c.jpg"></a></p><p>咖啡館內最為迷人的，也是最深深吸引我的，就是這塊偌大的透明玻璃窗。</p><p>窗戶透著外頭的陽光與綠枝，能清楚看見溫州街的一隅，坐在窗邊，瞬間也覺得自己的視野變得好寬廣。</p><p>儘管這天下過雨，但雨珠落在窗上的點點模樣，雖模糊了眼前視線，卻仍舊可愛的很。</p><p><a href="http://www.flickr.com/photos/108107144@N05/27796904453" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 0, 0);"><img src="https://farm8.staticflickr.com/7633/27796904453_3c53e17e45_c.jpg"></a></p><p><a href="http://www.flickr.com/photos/108107144@N05/27795691444" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 0, 0);"><img src="https://farm9.staticflickr.com/8854/27795691444_bf5b7f05a6_c.jpg"></a></p><p><a href="http://www.flickr.com/photos/108107144@N05/28129746480" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 0, 0);"><img src="https://farm9.staticflickr.com/8620/28129746480_e333b67bac_c.jpg"></a></p>`,
      },
      {
        id: "2",
        value: `<h1><strong>毛與花‧日系幽靜永康街咖啡廳，完美甜點，只有你的視角！in東門下午茶n訪，有插座</strong></h1><p>by&nbsp;<a href="https://blaircho.com/author/blaircho/" rel="noopener noreferrer" target="_blank" style="color: rgb(5, 173, 156);">Blaircho</a></p><p><br></p><p><a href="http://www.flickr.com/photos/141481751@N02/30029199858" rel="noopener noreferrer" target="_blank" style="color: rgb(5, 173, 156);"><img src="https://farm2.staticflickr.com/1831/30029199858_de6fb51f25_z.jpg"></a></p><p>第一次到<strong>羊毛與花Youmoutoohana</strong>，被門口一隻綿羊可愛的模樣吸引著，推開大門，店裡放著輕日系音樂，座位很寬敞，每個位置附近幾乎都有插座（大心），根本就是自由工作者的小天堂！文章一開始就直接進入我迫不及待想分享的“甜點”吧！真的太愛這裡了，所以不小心這個月就去了好幾次<strong>: )</strong></p><p><br></p><p><strong>▲焦糖脆片戚風 NT.140</strong></p><p>這是第二次才吃到，上一次想要點，最後一塊被前面的男子點走了QQ，這次一出爐（靠著敏銳的嗅覺）就馬上手刀奔去櫃台點一塊來吃！戚風很柔軟不甜，搭配上面甜滋滋的焦糖脆片，超級幸福。就是吃一口會覺得啊~好~甜~但下意識又再吃上一口這樣迷人的小戚風</p><p><a href="http://www.flickr.com/photos/141481751@N02/30029201058" rel="noopener noreferrer" target="_blank" style="color: rgb(5, 173, 156);"><img src="https://farm2.staticflickr.com/1798/30029201058_99ef0dcc96_z.jpg"></a></p><p><strong>▲蘋果派 NT.140</strong></p><p>這造型真的好討喜，在加熱的時候整間咖啡廳都是酥皮奶油香，不過蘋果派被我吃的好狼狽哈哈！因為一切下去很容易就碎掉了！但還是吃得很開心</p><p><a href="http://www.flickr.com/photos/141481751@N02/43850584572" rel="noopener noreferrer" target="_blank" style="color: rgb(5, 173, 156);"><img src="https://farm2.staticflickr.com/1839/43850584572_333860bd92_z.jpg"></a></p><p><strong>▲檸檬塔 NT.120</strong></p><p>羊毛與花的檸檬塔個人覺得CP值超高的！對於也愛做甜點的我，知道檸檬塔一定要加上足夠檸檬汁的量，才能達到令人皺眉酸溜溜的檸檬塔，如果妳也愛很偏酸的檸檬塔，那一定要點，吃完爽感100%</p><p><a href="http://www.flickr.com/photos/141481751@N02/43850584802" rel="noopener noreferrer" target="_blank" style="color: rgb(5, 173, 156);"><img src="https://farm2.staticflickr.com/1815/43850584802_d00b9556a9_z.jpg"></a></p><p>羊毛與花的飲料價格都在NT.150上下，<strong>焙茶拿鐵</strong>，雖然我平常是喝無糖的，我覺得這杯也不會太甜，大概就是微甜的程度！偶爾會想喝除了拿鐵的飲品，焙茶拿鐵茶味很香，但也不失鮮奶的濃醇，這杯的顏色我特別的著迷</p><p><a href="http://www.flickr.com/photos/141481751@N02/30029200058" rel="noopener noreferrer" target="_blank" style="color: rgb(5, 173, 156);"><img src="https://farm1.staticflickr.com/932/30029200058_a952deda76_z.jpg"></a></p><p>最喜歡看<strong>黑糖拿鐵</strong>那焦焦誘人的表面了，黑糖下是滑順奶泡，黑糖的甜味mix咖啡的苦味，真的很棒！工作時、心情稍微低落時，來上一杯黑糖拿鐵心情真的會立刻復原。除了調味咖啡也有手沖單品，咖啡愛好者不容錯過</p><p><a href="http://www.flickr.com/photos/141481751@N02/42089861090" rel="noopener noreferrer" target="_blank" style="color: rgb(5, 173, 156);"><img src="https://farm2.staticflickr.com/1831/42089861090_713dfc64a0_z.jpg"></a></p><p><strong>未成年請勿飲酒</strong></p><p>想要來一點酒，一點微醺的靈感？羊毛與花也有啤酒類，這天有買啤酒送一瓶清明，清明喝起來沒有太多氣，不喜歡啤酒有太多氣的可以嘗試看看</p><p><a href="http://www.flickr.com/photos/141481751@N02/30029201138" rel="noopener noreferrer" target="_blank" style="color: rgb(5, 173, 156);"><img src="https://farm2.staticflickr.com/1812/30029201138_046b849aa3_z.jpg"></a></p><p><strong>未成年請勿飲酒</strong></p><p>酒的種類還蠻多的，如果伴侶也喜歡小酌，就帶他來吧！</p><p><a href="http://www.flickr.com/photos/141481751@N02/30029201298" rel="noopener noreferrer" target="_blank" style="color: rgb(5, 173, 156);"><img src="https://farm2.staticflickr.com/1795/30029201298_713dfc64a0_z.jpg"></a></p><p>就像賣火柴的女孩，每次都會駐足在蛋糕櫃前面，羊毛與花的甜點櫃閃閃發光啊！每次都會有幾樣新的甜點，不止不會吃膩，內心也多了一份小期待</p><p><a href="http://www.flickr.com/photos/141481751@N02/44192638311" rel="noopener noreferrer" target="_blank" style="color: rgb(5, 173, 156);"><img src="https://farm2.staticflickr.com/1896/44192638311_e2b2520d39_z.jpg"></a></p><p>滿滿金黃色芒果的<strong>芒果派</strong>，底部派皮是扎實的，當季的水果好好吃！店員每次都會很貼心的附上兩支叉子</p><p><a href="http://www.flickr.com/photos/141481751@N02/43474754924" rel="noopener noreferrer" target="_blank" style="color: rgb(5, 173, 156);"><img src="https://farm2.staticflickr.com/1896/43474754924_c2964d239e_z.jpg"></a></p><p><strong>冷泡茶</strong>，無糖、茶葉充分泡開，夏天喝超消暑！</p>`,
      },
      {
        id: "3",
        value: `<p><strong>台北麟光站咖啡廳六張犁美食餐廳咖啡廳下午茶&nbsp;</strong><strong style="color: rgb(117, 46, 128);">小米酒咖啡館</strong>&nbsp;~</p><p><img src="https://kellyrosie12.com/wp-content/uploads/pixnet/1620146104-3800021344-g_l.jpg"></p><p>&nbsp;</p><p>發現一間隱藏在巷弄街邊的文青質感咖啡廳，迷人的門面設計充滿濃濃異國風情，讓人誤以為路過了歐洲咖啡館~</p><p>一進入店內，卻又瞬間掉進了充滿咖啡香的圖書館~</p><p>位在大安區巷弄裡的&nbsp;<strong style="color: rgb(117, 46, 128);">小米酒咖啡館&nbsp;</strong>從<strong>捷運六張犁站</strong>步行至店約10分鐘、<strong>麟光站</strong>約6分鐘。</p><p>&nbsp;</p><p><span style="color: rgb(139, 25, 16);">《店家資訊》</span></p><p><span style="color: rgb(139, 25, 16);">小米酒咖啡館</span></p><p><span style="color: rgb(139, 25, 16);">地址：大安區和平東路三段308巷37號</span></p><p><span style="color: rgb(139, 25, 16);">電話：02-2395 7617</span></p><p><span style="color: rgb(139, 25, 16);">營業時間：12:00-19:00（週一公休）</span></p><p>&nbsp;</p>`,
      },
    ],
  },
];

const userFlows = [
  {
    id: "user1_1",
    name: "AI & ML",
    src: "",
    time: "1",
    nextNodeId: 6,
    nodes: [
      {
        width: 150,
        height: 50,
        id: "1",
        data: {
          label: "SVM",
          toolbarPosition: "top",
        },
        type: "CustomNode",
        position: {
          x: -51.8546343034143,
          y: 59.80381062834235,
        },
        style: {
          border: "2px solid",
          background: "white",
          borderRadius: 10,
          height: 50,
          width: 150,
        },
        selected: false,
        positionAbsolute: {
          x: -51.8546343034143,
          y: 59.80381062834235,
        },
        dragging: false,
      },
      {
        width: 150,
        height: 50,
        id: "2",
        data: {
          label: "Linear",
          toolbarPosition: "top",
        },
        type: "CustomNode",
        position: {
          x: 182.39213502643167,
          y: 163.92809001762106,
        },
        style: {
          border: "2px solid",
          background: "white",
          borderRadius: 10,
          height: 50,
          width: 150,
        },
        selected: false,
        positionAbsolute: {
          x: 182.39213502643167,
          y: 163.92809001762106,
        },
        dragging: false,
      },
      {
        width: 150,
        height: 50,
        id: "3",
        data: {
          label: "Tree",
          toolbarPosition: "top",
        },
        type: "CustomNode",
        position: {
          x: 458.5946066235496,
          y: 55,
        },
        style: {
          border: "2px solid",
          background: "white",
          borderRadius: 10,
          height: 50,
          width: 150,
        },
        selected: false,
        positionAbsolute: {
          x: 458.5946066235496,
          y: 55,
        },
        dragging: false,
      },
      {
        width: 150,
        height: 50,
        id: "4",
        data: {
          label: "CNN",
          toolbarPosition: "top",
        },
        type: "CustomNode",
        position: {
          x: 465.5376019884244,
          y: 294.50060870402757,
        },
        style: {
          border: "2px solid",
          background: "white",
          borderRadius: 10,
          height: 50,
          width: 150,
        },
        selected: false,
        positionAbsolute: {
          x: 465.5376019884244,
          y: 294.50060870402757,
        },
        dragging: false,
      },
      {
        width: 150,
        height: 50,
        id: "5",
        data: {
          label: "RNN",
          toolbarPosition: "top",
        },
        type: "CustomNode",
        position: {
          x: 747,
          y: 170,
        },
        style: {
          border: "2px solid",
          background: "white",
          borderRadius: 10,
          height: 50,
          width: 150,
        },
        selected: false,
        positionAbsolute: {
          x: 747,
          y: 170,
        },
        dragging: false,
      },
    ],
    edges: [
      {
        source: "1",
        sourceHandle: null,
        target: "2",
        targetHandle: null,
        id: "reactflow__edge-1-2",
      },
      {
        source: "2",
        sourceHandle: null,
        target: "3",
        targetHandle: null,
        id: "reactflow__edge-2-3",
      },
      {
        source: "4",
        sourceHandle: null,
        target: "5",
        targetHandle: null,
        id: "reactflow__edge-4-5",
      },
      {
        source: "3",
        sourceHandle: null,
        target: "5",
        targetHandle: null,
        id: "reactflow__edge-3-5",
      },
      {
        source: "2",
        sourceHandle: null,
        target: "4",
        targetHandle: null,
        id: "reactflow__edge-2-4",
      },
    ],
    viewport: {
      x: 196.05312742978094,
      y: 53.667504960810476,
      zoom: 0.8827029962906545,
    },
  },
  {
    id: "user1_2",
    name: "Software Development",
    src: "",
    time: "2",
    nextNodeId: 3,

    nodes: [
      {
        width: 150,
        height: 50,
        id: "1",
        data: {
          label: "Web API",
          toolbarPosition: "top",
        },
        type: "CustomNode",
        position: {
          x: 310,
          y: 189,
        },
        style: {
          border: "2px solid",
          background: "white",
          borderRadius: 10,
          height: 50,
          width: 150,
        },
        selected: false,
        positionAbsolute: {
          x: 310,
          y: 189,
        },
        dragging: false,
      },
      {
        width: 150,
        height: 50,
        id: "2",
        data: {
          label: "Scrum",
          toolbarPosition: "top",
        },
        type: "CustomNode",
        position: {
          x: 652,
          y: 110,
        },
        style: {
          border: "2px solid",
          background: "white",
          borderRadius: 10,
          height: 50,
          width: 150,
        },
        selected: false,
        positionAbsolute: {
          x: 652,
          y: 110,
        },
        dragging: false,
      },
    ],
    edges: [
      {
        source: "1",
        sourceHandle: null,
        target: "2",
        targetHandle: null,
        id: "reactflow__edge-1-2",
      },
    ],
    viewport: {
      x: -11,
      y: -71,
      zoom: 1,
    },
  },
  {
    id: "user1_3",
    name: "Cafe Journal",
    src: "",
    time: "3",
    nextNodeId: 4,

    nodes: [
      {
        width: 150,
        height: 50,
        id: "1",
        data: {
          label: "AGCT",
          toolbarPosition: "top",
        },
        type: "CustomNode",
        position: {
          x: 140,
          y: 70,
        },
        style: {
          border: "2px solid",
          background: "white",
          borderRadius: 10,
          height: 50,
          width: 150,
        },
        selected: false,
        positionAbsolute: {
          x: 140,
          y: 70,
        },
        dragging: false,
      },
      {
        width: 150,
        height: 50,
        id: "2",
        data: {
          label: "羊毛與花",
          toolbarPosition: "top",
        },
        type: "CustomNode",
        position: {
          x: 657,
          y: 116,
        },
        style: {
          border: "2px solid",
          background: "white",
          borderRadius: 10,
          height: 50,
          width: 150,
        },
        selected: false,
        positionAbsolute: {
          x: 657,
          y: 116,
        },
        dragging: false,
      },
      {
        width: 150,
        height: 50,
        id: "3",
        data: {
          label: "小米酒",
          toolbarPosition: "top",
        },
        type: "CustomNode",
        position: {
          x: 406,
          y: 203,
        },
        style: {
          border: "2px solid",
          background: "white",
          borderRadius: 10,
          height: 50,
          width: 150,
        },
        selected: false,
        positionAbsolute: {
          x: 406,
          y: 203,
        },
        dragging: false,
      },
    ],
    edges: [
      {
        source: "3",
        sourceHandle: null,
        target: "2",
        targetHandle: null,
        id: "reactflow__edge-3-2",
      },
      {
        source: "1",
        sourceHandle: null,
        target: "3",
        targetHandle: null,
        id: "reactflow__edge-1-3",
      },
    ],
    viewport: {
      x: 137,
      y: -22,
      zoom: 1,
    },
  },
  {
    id: "user1_4",
    name: "DS",
    time: "1",
  },
  {
    id: "user1_5",
    name: "SA",
    time: "1",
  },
  {
    id: "user1_6",
    name: "SAD",
    time: "1",
  },
];

export { userFlows, userFlowNode };
