describe("EncryptAnswerService tests", function() {
  var group = {
    "g":"27257469383433468307851821232336029008797963446516266868278476598991619799718416119050669032044861635977216445034054414149795443466616532657735624478207460577590891079795564114912418442396707864995938563067755479563850474870766067031326511471051504594777928264027177308453446787478587442663554203039337902473879502917292403539820877956251471612701203572143972352943753791062696757791667318486190154610777475721752749567975013100844032853600120195534259802017090281900264646220781224136443700521419393245058421718455034330177739612895494553069450438317893406027741045575821283411891535713793639123109933196544017309147",
    "p":"49585549017473769285737299189965659293354088286913371933804180900778253856217662802521113040825270214021114944067918826365443480688403488878664971371922806487664111406970012663245195033428706668950006712214428830267861043863002671272535727084730103068500694744742135062909134544770371782327891513041774499809308517270708450370367766144873413397605830861330660620343634294061022593630276805276836395304145517051831281606133359766619313659042006635890778628844508225693978825158392000638704210656475473454575867531351247745913531003971176340768343624926105786111680264179067961026247115541456982560249992525766217307447",
    "q":"24792774508736884642868649594982829646677044143456685966902090450389126928108831401260556520412635107010557472033959413182721740344201744439332485685961403243832055703485006331622597516714353334475003356107214415133930521931501335636267863542365051534250347372371067531454567272385185891163945756520887249904654258635354225185183883072436706698802915430665330310171817147030511296815138402638418197652072758525915640803066679883309656829521003317945389314422254112846989412579196000319352105328237736727287933765675623872956765501985588170384171812463052893055840132089533980513123557770728491280124996262883108653723"
  };

  var EncryptAnswerService;
  var ElGamal;
  var BigInt;
  var stringify;

  beforeEach(module("avCrypto"));

  beforeEach(inject(function (_EncryptAnswerService_, _ElGamalService_, _BigIntService_, _DeterministicJsonStringifyService_) {
    EncryptAnswerService = _EncryptAnswerService_;
    ElGamal = _ElGamalService_;
    BigInt = _BigIntService_;
    stringify = _DeterministicJsonStringifyService_;
  }));

  it("should encrypt and prove plaintext knowledge", inject(function() {
    // random plaintext in arbitrary range
    var plaintext = Math.floor(Math.random() * 10000) + 1;
    console.log(plaintext);

    var params = new ElGamal.Params(
      BigInt.fromInt(group.p),
      BigInt.fromInt(group.q),
      BigInt.fromInt(group.g));
    // generate private and public keys
    var secret = params.generate();
    // encrypt
    var encryptor = EncryptAnswerService(secret.pk.toJSONObject());
    var encrypted = encryptor.encryptAnswer(plaintext);

    // verify plaintext proof
    expect(encryptor.verifyPlaintextProof(encrypted)).toBe(true);

    // verify decryption works
    var ctext = new ElGamal.Ciphertext(
      BigInt.fromInt(encrypted.alpha),
      BigInt.fromInt(encrypted.beta),
      secret.pk);
    var decrypted = secret.decryptAndProve(
      ctext,
      ElGamal.fiatshamir_dlog_challenge_generator);
    var plaintextDecrypted = decrypted.plaintext.getPlaintext().intValue();

    expect(plaintextDecrypted).toBe(plaintext);
    console.log(plaintextDecrypted);
  }));

  it("should encrypt and prove knowledge, with given pubkey", inject(function (){
    var pubkey = {
      "y":"9267959900687597160746074643729934857841198969021980876068002060220602759527328533647175257313381164854420254149677218896232268568570733755307271694359348266941702343277973832308703389291190679634220764783536337019012562580218818396298483940932931027417186566941173055388683173894471639879078838281758381965406225983012056060052802897439630276494541453496407716664005385770540295468027512544576240148635705927178700385234474792943684596349069778834084422799614980047979134434012297230117346318686335716367636978288382955351431559184099910959364922854379540127324113150138959782731420861666435877461272249942053036514",
      "g":"27257469383433468307851821232336029008797963446516266868278476598991619799718416119050669032044861635977216445034054414149795443466616532657735624478207460577590891079795564114912418442396707864995938563067755479563850474870766067031326511471051504594777928264027177308453446787478587442663554203039337902473879502917292403539820877956251471612701203572143972352943753791062696757791667318486190154610777475721752749567975013100844032853600120195534259802017090281900264646220781224136443700521419393245058421718455034330177739612895494553069450438317893406027741045575821283411891535713793639123109933196544017309147",
      "q":"24792774508736884642868649594982829646677044143456685966902090450389126928108831401260556520412635107010557472033959413182721740344201744439332485685961403243832055703485006331622597516714353334475003356107214415133930521931501335636267863542365051534250347372371067531454567272385185891163945756520887249904654258635354225185183883072436706698802915430665330310171817147030511296815138402638418197652072758525915640803066679883309656829521003317945389314422254112846989412579196000319352105328237736727287933765675623872956765501985588170384171812463052893055840132089533980513123557770728491280124996262883108653723",
      "p":"49585549017473769285737299189965659293354088286913371933804180900778253856217662802521113040825270214021114944067918826365443480688403488878664971371922806487664111406970012663245195033428706668950006712214428830267861043863002671272535727084730103068500694744742135062909134544770371782327891513041774499809308517270708450370367766144873413397605830861330660620343634294061022593630276805276836395304145517051831281606133359766619313659042006635890778628844508225693978825158392000638704210656475473454575867531351247745913531003971176340768343624926105786111680264179067961026247115541456982560249992525766217307447"
    };
    var randomness = 487303;
    var encryptedAnswer = {"alpha": "47764235844334937700612373333792319676546511665636387828342656680188417945647324095182980202763626083943985494326287698663375265654128766472666934032648897121155056244757937825120552259427756389522227599629149084179799430985283086724999213476598156361199638811748378892367365972180310463155162698018228547657989993645793030314825553324867636813310627712483288203654100410290054495628701309901928536410013506575026292500438732338357341620782640687530661689071151087947038169567186384745284884755035449818481032334946473257757429775371331658331450606857470724808596379951939171516983196750301496768444206966051341337793", "beta": "22888315838830418528005184711959479147870204270080575984336493042452700291397265362865195810484490256492277450633567810745906429634973720135721687500822346997859311947451980592682785119302588835166285329695140330852367435850863306443063559004592311099112060453434915573771687748558415804582277310424885188143627806041272728774828887382203727365448357314577730704267348500417858869748234848189555014609531477975917624095958277943479635698524466814821501635103458442120127697432001399492798153819405255320627096679599190922928235900536599121441097315725850237338887167629533534119508146958766642574604920666621989733761", "challenge": "112890655923664498742121219379321601012505324891497826962348892970584057773280", "commitment": "18071949621575680571159751423579366038854308543991344604078712092155801055371661839761426074469925134034184122683452279080609604497385880164654350865249858485249627704136904308197421469882302403885172038283640635532420333997981658886813980793331364565345537258808833858409761500298595486143209591315243996950865656220839486632646667841555213367606380609947133318124877513861080417795846135741881401246080400033369868154468805838600458122910354290555263652878470163578049403926317616587039186620940980668242735427180157767825178653255489447557175823053778044515714036102318212511256788546194473844282472721727857678930", "response": "10430316631724430513605258796396285605851638383933979317100797045794079080174370486702809610473854442163491963636136151810282119737707745139270576084726334161717004123541771899482274977729957280322702077091355946637210945001993541929035310517577905354175892493988667335129449877724768642752133084322208342467708613164714745209975439736345769890284125266831389617649387765676210709858651535695495705629583198562662353848606755319638383526752199018977337518233248544521197166520068374043036331272306544294396764753965007770062962760823155775070227540319148563386891793822954568272735100232752335449633905714091738114840"};

    var plaintext = Math.floor(Math.random() * 10000) + 1;

    // encrypt
    var encryptor = EncryptAnswerService(pubkey);
    var encrypted = encryptor.encryptAnswer(plaintext, randomness);
    // verify encrypted vote is bit by bit exact
    expect(stringify(encrypted)).toBe(stringify(encryptedAnswer));

    // verify plaintext proof
    expect(encryptor.verifyPlaintextProof(encrypted)).toBe(true);
  }));
});